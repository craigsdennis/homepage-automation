function paramsFromEvent(event) {
    const params = {};
    // First populate from a possible `collect` call...not the kind from prison.
    // https://www.twilio.com/docs/autopilot/actions/collect
    const memory = JSON.parse(event.Memory);
    const collectedData =
        memory && memory.twilio && memory.twilio.collected_data;
    if (collectedData) {
        for (formKey of Object.keys(collectedData)) {
            // All collected data is persistent for the session
            // We only want to keep versions that have been set since we last queued a command
            if (
                memory.lastCommandQueuedAt &&
                collectedData[formKey].date_completed <
                    memory.lastCommandQueuedAt
            ) {
                continue;
            }
            let answers = collectedData[formKey].answers;
            for (fieldName of Object.keys(answers)) {
                let answer = answers[fieldName].answer;
                params[fieldName] = answer;
            }
        }
    }
    // Then override any memory if the Field values are present on the request
    // Fields are not persisted
    for (key of Object.keys(event)) {
        let fieldName = key.match(/Field_(.*)_Value/);
        if (fieldName && fieldName.length > 0) {
            params[fieldName[1]] = event[key];
        }
    }
    return params;
}

async function addToCommandQueue(commandName, params) {
    const sync = Runtime.getSync();
    await sync.lists('commands').syncListItems.create({
        data: { commandName, params },
    });
}

function randomChoice(iterable) {
    return iterable[Math.floor(Math.random() * iterable.length)];
}

const helpPrompts = [
    'What else do you have in mind?',
    'Anything else I can do for you?',
    'How else can I help?',
];

function randomAffirmationFor(commandName, params) {
    const affirmations = ['Alrighty!', 'Sure, no problem!', 'You got it!'];
    if (Object.values(params).length > 0) {
        const randomValue = randomChoice(Object.values(params));
        affirmations.push(`Okay, let me see here, ${randomValue}...alright.`);
        affirmations.push(`Nice choice, ${randomValue}. There we go!`);
        affirmations.push(`Oh yeah good call on the ${randomValue}!`);
    }
    return randomChoice(affirmations);
}

exports.handler = async function(context, event, callback) {
    const commandName = event.CurrentTask;
    const params = paramsFromEvent(event);
    try {
        await addToCommandQueue(commandName, params);
    } catch (err) {
        console.error(err);
        return callback(err);
    }
    console.log(event.Memory);

    // Success!
    let affirmation = randomAffirmationFor(commandName, params);
    affirmation += '  ' + randomChoice(helpPrompts);
    const responseObject = {
        actions: [
            {
                say: affirmation,
            },
            {
                remember: {
                    lastCommandQueuedAt: new Date(),
                },
            },
            {
                listen: true,
            },
        ],
    };
    callback(null, responseObject);
};
