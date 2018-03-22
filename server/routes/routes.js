import _ from 'lodash';
//import jsonfile from 'jsonfile';
//import packageJson from '../package.json';
import request from 'request'
import path from 'path'
import Q from 'q';

//const kibanaVersion = packageJson.kibana.version;


export default function (server) {

    const elastic = server.plugins.elasticsearch;
    let callWithRequest;

    if (elastic["callWithRequest"]) {
        callWithRequest = elastic.callWithRequest;
    }
    else {
        callWithRequest = elastic.getCluster('data').callWithRequest;
    }

    server.route({
      path: '/api/getIndexPattern',
      method: 'POST',
      handler(req, reply) {
        //let deferred = Q.defer();
        console.log(req.payload);
        var url = 'http://127.0.0.1:9200/.kibana/doc/index-pattern:' + req.payload.title
        console.log(url);
        request.get(url, function (error, response, body) {
            if (error) {
                console.log(error);
            }
            let res = JSON.parse(body);
            //return res
            console.log(res.found)
            reply(res)
        })
      }
    });
    server.route({
        path: '/api/createIndexPattern',
        method: 'POST',
        handler(req, reply) {
          console.log(req.payload)
          var url = 'http://127.0.0.1:9200/.kibana/doc/index-pattern:' + req.payload.title
          let options = {
              headers: {'content-type': 'application/json'},
              url: url,
              json: {'type':'index-pattern', 'index-pattern' : {'timeFieldName': req.payload.timeFieldName, 'title': req.payload.title}}
          };
          request.post(options, function (error, response, body) {
              try {
                  if (error) {
                      console.log(error);
                      reply(error);
                  }
                  else {
                      reply(body);
                  }
              } catch (e) {
                  console.log(e);
                  reply(e);

              }
          });
        }
    });

    server.route({
        path: '/api/createShortUrl',
        method: 'POST',
        handler(req, reply) {
          var url = 'http://127.0.0.1:9200/.kibana/doc/url:shorturl' + req.payload.title
          var suburl = "/app/kibana#/discover?_g=()&_a=(columns:!(_source),index:" + "'" + req.payload.title + "'" + ",interval:auto,query:(language:lucene,query:''),sort:!('@timestamp',desc))"
          let options = {
              headers: {'content-type': 'application/json'},
              url: url,
              json: {'type':'url', 'url' : {'url': suburl}}
          };
          request.post(options, function (error, response, body) {
              try {
                  if (error) {
                      console.log(error);
                      reply(error);
                  }
                  else {
                      reply(body);
                  }
              } catch (e) {
                  console.log(e);
                  reply(e);

              }
          });
        }
    });
};
