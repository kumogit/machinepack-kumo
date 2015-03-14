module.exports = {

  friendlyName: 'Get user data',

  description: 'Gets all the user information',

  extendedDescription: '',

  inputs: {
    userId: {
      example: '1',
      description: 'The UserId of the user',
      required: true
    }
  },

  defaultExit: 'success',

  exits: {

    error: {
      description: 'There was an error occured',
    },

    invalidUser: {
      description: 'No user found'
    },

    success: {
      description: 'Return JSON containing user data.',
    },
  },

  fn: function (inputs,exits) {

    var URL = require('url');
    var QS = require('querystring');
    var _ = require('lodash');
    var Http = require('machinepack-http');

    Http.sendHttpRequest({
      baseUrl: 'http://neatlive.com:1337/user/' + inputs.userId,
      url: '',
      method: 'get',
    }).exec({
      // OK.
      success: function(result) {

        try {
          var responseBody = JSON.parse(result.body);
        } catch (e) {
          return exits.error('An error occurred while parsing the body.');
        }

        return exits.success(responseBody);

      },
      // Non-2xx status code returned from server
      notOk: function(result) {

        try {
          if (result.status === 404) {
            return exits.invalidUser("Invalid userId");
          }
        } catch (e) {
          return exits.error(e);
        }

      },
      // An unexpected error occurred.
      error: function(err) {

        exits.error(err);
      },
    });
  },
};
