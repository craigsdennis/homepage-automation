/**
 * Reset CommandQueue
 *
 * path: /reset-command-queue
 * [ ] Check for valid Twilio signature
 * Event: Incoming Message
 */

exports.handler = async function(context, event, callback) {
    const sync = Runtime.getSync();
    try {
        await sync.lists('commands').remove();
    } catch (err) {
        console.error('Uh oh', err);
    }
    let response = new Twilio.Response();
    response.setStatusCode(200);
    response.setHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
    });
    response.appendHeader();
    try {
        await sync.lists.create({ uniqueName: 'commands' });
        response.setBody({ status: 'success' });
    } catch (err) {
        callback(err);
    }
    callback(null, response);
};
