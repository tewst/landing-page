const functions = require('firebase-functions');
const dialogflow = require('dialogflow');
const serviceAccount = functions.config().service_account;

const app = 'tewst-landing-page';
const sessionClient = new dialogflow.SessionsClient({
  credentials: serviceAccount,
});

exports.search = functions.https.onRequest((request, response) => {
  const cx = '013887321856262968721:y8vq-syjqom';
  response.redirect(`https://cse.google.com/cse?cx=${cx}&q=${request.query.name}`);
});

exports.suggest = functions.https.onRequest((request, response) => {
  const yu = '5519222721557041240';
  response.redirect(`https://suggest.yandex.ru/suggest-ff.cgi?part=${request.query.text}&amp;uil=ru&amp;v=3&amp;sn=5&amp;lr=10371&amp;yu=${yu}`);
});

exports.dialog = functions.https.onRequest(async (request, response) => {
  const sessionPath = sessionClient.sessionPath(
    app,
    request.body.session.session_id,
  );
  const responses = await sessionClient.detectIntent({
    session: sessionPath,
    queryInput: {
      text: {
        text: request.body.request.original_utterance,
        languageCode: request.body.meta.locale.toLowerCase(),
      },
    },
  });
  response.send({
    response: {
      text: responses[0].queryResult.fulfillmentText,
      end_session: false,
    },
    version: request.body.version,
  });
});