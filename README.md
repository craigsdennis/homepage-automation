# Home(page) Automation
This [experiment](https://craigsdennis.github.io/homepage-automation) is built using a smattering of [Twilio](https://twilio.com)offerings.

First and foremost, this is leaning very heavily on [AutoPilot](https://twilio.com/autopilot). This is what creates the bot like experience through many channels of communication.

This project is also [Serverless](https://www.twilio.com/docs/glossary/what-is-serverless-architecture). I'm hosting on GitHub pages, and making use of Twilio [Functions](https://twilio.com/functions).
        
The realtime data is being provided via a product named [Twilio Sync](https://twilio.com/sync). Any item added to the `Sync` `List` is then handled by any functions that subscribe to specific commands.

### TODO
[x] - Actions that collect what you can do in AutoPilot
[x] - Function that accepts collected information
[x] - Sync list(?) that puts action, params
[x] - Client that accepts ordered list and applies the changes
[x] - Debuggability
