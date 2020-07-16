
module.exports = (req, res) => {
  var responseTime = require('response-time')
  require('events').EventEmitter.defaultMaxListeners = 150;

  let progress = {};
  let MAX_ACCUMULATE = 500;
  let base_url = false;
  let DELIM = '-';
  let REGEX_PIPE = /\|/g;
  let accumulate = [];
  
  function replacePipeChar(str) {
    if (str instanceof RegExp) {
      str = str.toString();
    }
    return str && str.replace(REGEX_PIPE, DELIM);
  }

  function getRoute(req, base_url) {
    const routePath = req.route && req.route.path ? req.route.path : '';
    const baseUrl = (base_url !== false) ? req.baseUrl : '';
    return baseUrl + replacePipeChar(routePath);
  }

  req.use(responseTime(function (req, res, time) {
    if (!req._startTime) {
      req._startTime = new Date();
    }

    const route = getRoute(req, base_url);
    progress[req.method + route] = [time];

    if (route === '/status') {
      req._accumulate = accumulate;
      
    }
    let statTags = {};

    statTags.startTime = req._startTime;
    statTags.endTime = new Date();
    statTags.route = route;
    statTags.method = req.method.toLowerCase();
    statTags.protocol = req.protocol;
    statTags.statusCode = res.statusCode;
    statTags.responseTime = time;
    
    accumulate = [statTags, ...accumulate.slice(0, MAX_ACCUMULATE)];
  }))

  req.get("/netdata-status", (req, res) => {
    const result = {};

    result.totalRequests = accumulate.length;

    result.totalByMethods = accumulate.reduce((map, a) => ({
      ...map,
      [a.method]: (map[a.method] || 0) + 1,
    }), {})

    result.totalRoute = accumulate.reduce((map, a) => ({
      ...map,
      [a.route]: (map[a.route] || 0) + 1,
    }), {})
    result.totalStatusCode = accumulate.reduce((map, a) => ({
      ...map,
      [a.statusCode]: (map[a.statusCode] || 0) + 1,
    }), {})

    result.recentResponseTime = progress;

    result.accumulated = accumulate;
    accumulate = [];
    
    res.json(result);
  });

};

