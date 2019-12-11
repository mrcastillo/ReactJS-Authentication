import _ from "lodash";

class Report {
    constructor(app){
        this.app = app;

        this.model = {
            rotation: null,
            status: null,
            timeframe: null,
            description: null,
            resource: null,
            rfc: null,
            ipsoft_ticket: null
        }
    }

    initWithObject(object) {
        this.model.rotation = _.get(object, "rotation");
        this.model.status = _.get(object, "status");
        this.model.timeframe = _.get(object, "timeframe");
        this.model.description = _.get(object, "description");
        this.model.resource = _.get(object, "resource");
        this.model.rfc = _.get(object, "rfc");
        this.model.ipsoft_ticket = _.get(object, "ipsoft_ticket");
        return this;
    }

    toJSON(){
        return this.model;
    }
}


export default Report;