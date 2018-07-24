import _ from 'lodash';
import packageJson from '../package.json';
import request from 'request'
import path from 'path'
import Q from 'q';

const kibanaVersion = packageJson.kibana.version;


export default function (server) {

   const elastic = server.plugins.elasticsearch;
   let callWithRequest;
   callWithRequest = elastic.getCluster('data').callWithRequest;

    server.route({
      path: '/api/getIndexPattern',
      method: 'POST',
      handler(req, reply) {
        let request = {
            index: '.kibana',
            type: 'doc',
            body:JSON.parse('{"query": {"bool": {"must": [{"match_phrase": {"index-pattern.title": {"query": "'+req.payload.title+'"}}}]}},"_source": ""}')
        };
        callWithRequest(req,'search', request).then(function (response) {
          reply(response);
          },
          function (error) {
              reply(null);
          }
        );
      }
    });

    server.route({
        path: '/api/createIndexPattern',
        method: 'POST',
        handler(req, reply) {
          let body = {
            'type':'index-pattern',
            'index-pattern' :{'timeFieldName': req.payload.timeFieldName, 'title': req.payload.title}
          };
          let request = {
            index: '.kibana',
            type: 'doc',
            id: 'index-pattern:' + req.payload.title,
            body: body
          }
          callWithRequest(req,'create', request).then(function (response) {
            reply(response)
          });
        }
    });

    server.route({
        path: '/api/createShortUrl',
        method: 'POST',
        handler(req, reply) {
          var suburl = "/app/kibana#/discover?_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-1h,mode:quick,to:now))&_a=(columns:!(_source),index:" + "'" + req.payload.title + "'" + ",interval:auto,query:(language:lucene,query:''),sort:!('@timestamp',desc))"
          let body = {
            'type':'url',
            'url' : {'url': suburl }
          };
          let request = {
            index: '.kibana',
            type: 'doc',
            id: 'url:shorturl' + req.payload.title,
            body: body
          }
          callWithRequest(req,'create', request).then(function (response) {
            reply(response)
          });
        }
    });

    server.route({
      path: '/api/getShortUrl',
      method: 'POST',
      handler(req, reply) {
        let request = {
            index: '.kibana',
            type: 'doc',
            id: 'url:shorturl' + req.payload.title
        };
        callWithRequest(req,'get', request).then(function (response) {
          reply(response);
          },
          function (error) {
              reply(null);
          }
        );
      }
    });

    server.route({
      path: '/api/getIndexDocumentCount',
      method: 'POST',
      handler(req, reply) {
        let request = {
            index: req.payload.title,
            type: 'logs',
            id: '_count'
        };
        callWithRequest(req,'get', request).then(function (response) {
          reply(response);
          },
          function (error) {
              reply(null);
          }
        );
      }
    });
};
