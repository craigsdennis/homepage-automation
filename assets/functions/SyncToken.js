/**
 *  Sync Token Template
 *
 *  This Template shows you how to mint Access Tokens for Twilio Sync. Please note, this is for prototyping purposes
 *  only. You will want to validate the identity of clients requesting Access Token in most production applications and set
 *  the identity when minting the Token.
 *
 *  Pre-requisites
 *  - Create a Sync Service (https://www.twilio.com/docs/api/sync/rest/services)
 *   - Create an API Key (https://www.twilio.com/console/runtime/api-keys)
 */

exports.handler = function(context, event, callback) {
    // make sure you enable ACCOUNT_SID and AUTH_TOKEN in Functions/Configuration
    const ACCOUNT_SID = context.ACCOUNT_SID;

    const SERVICE_SID = context.SYNC_SERVICE_SID;
    const API_KEY = context.TWILIO_API_KEY;
    const API_SECRET = context.TWILIO_API_SECRET;

    // REMINDER: This identity is only for prototyping purposes
    const IDENTITY = 'only for testing';

    const AccessToken = Twilio.jwt.AccessToken;
    const SyncGrant = AccessToken.SyncGrant;

    const syncGrant = new SyncGrant({
        serviceSid: SERVICE_SID,
    });

    const accessToken = new AccessToken(ACCOUNT_SID, API_KEY, API_SECRET);

    accessToken.addGrant(syncGrant);
    accessToken.identity = IDENTITY;
    // Modification of template starts here
    let response = new Twilio.Response();
    response.setStatusCode(200);
    response.setHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
    });
    response.appendHeader();
    response.setBody({ token: accessToken.toJwt() });
    callback(null, response);
};
