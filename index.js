import {resolve} from 'path';
import api from './server/routes';

export default function (kibana) {
    return new kibana.Plugin({
        require: ['elasticsearch'],

        uiExports: {

            app: {
                title: 'Patternizer',
                description: 'This plugin allow you to create index pattern if it does not exist',
                main: 'plugins/patternizer/app',
                //icon: 'plugins/indexpatterncreator/icon.svg'
            }

        },

        config(Joi) {
            return Joi.object({
                enabled: Joi.boolean().default(true),
            }).default();
        },


        init(server, options) {
            api(server);
        }


    });
};
