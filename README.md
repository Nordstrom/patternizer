# indexpatterncreator

[![Build Status](https://api.travis-ci.org/Nordstrom/indexpatterncreator.svg?branch=master)](https://travis-ci.org/Nordstrom/indexpatterncreator)

Kibana plugin to create index pattern if it does not exists

1. If the plugin link is accessed directly from the kibana left pane menu, you will be redirected to a page index pattern can be created

2. If the plugin is accessed through an url with the query parameter name 'target', which has the index pattern value, you will be directed to the plugin page
   eg: https://kibana.dev.datalens.r53.nordstrom.net/app/indexpatterncreator#/?target=logst*
   a. If the pattern (logst*) already exists, you will be able to access the discover page with the given pattern
   b. If the pattern (logst*) does not exist already, pattern will be created and will be redirected to the discover page with the given pattern
