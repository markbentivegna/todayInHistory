const Alexa = require('ask-sdk-core');
const request = require('request');

function getFact(callback) {
  return new Promise(function(resolve, reject) {
    request('https://history.muffinlabs.com/date', { json: true }, function(err, res, body) {
      if (err) {
        console.log(err);
      } 
      else {
        callback(body);
      }
    })
  })
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    return new Promise((resolve) => {
      getFact((result) => {
        var max = result.data.Events.length;
        var index = Math.floor(Math.random() * Math.floor(max));

        const speakOutput = result.data.Events[index].text;

        resolve(handlerInput.responseBuilder.speak(speakOutput).getResponse());
      })
    });
  },
};


const TodayHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TodayIntent';
  },
  handle(handlerInput) {
    return new Promise((resolve) => {
      getFact((result) => {
        var max = result.data.Events.length;
        var index = Math.floor(Math.random() * Math.floor(max));

        const speakOutput = result.data.Events[index].text;

        resolve(handlerInput.responseBuilder.speak(speakOutput).getResponse());
      })
    });
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speakOutput = 'Ask me what happened today in history!';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  },
};

const CancelAndStopHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speakOutput = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(error.trace);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    TodayHandler,
    HelpHandler,
    CancelAndStopHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
