import React from "react";
import { Switch, Route } from "react-router-dom";
import axios from "axios";
import _ from "lodash";

//Components
import ForumRoot from "./ForumRoot";
import ForumThreads from "./ForumThreads";

class Forum extends React.Component {
    constructor(props){
        super(props);

        //Setup data for our forum categories
        this.state = {
            forumCategories: []
        }
    };

    componentDidMount() {
        axios.get("http://localhost:8080/forum")
        .then((categories) => {
            categories = categories.data;

            this.setState({
                forumCategories: categories
            });
        })
        .catch((error) => {
            console.error(error);
        });
    };

    render(){
        const URL = this.props.match.path;
        const routeElements = [];

        if(this.state.forumCategories.length > 0) {
            _.each(this.state.forumCategories, (category, key) => {    
                //Remove white space from URL            
                var categoryURL = category.subject.replace(/\s+/g, '');
                //Make URL lowercase
                categoryURL = categoryURL.toLowerCase();
                //Push our category routes
                routeElements.push(
                    <Route path={`${URL}/${categoryURL}`} render={(props) => <ForumThreads {...props} category={category}/>} key={key} />
                )
            });
        }

        const NoMatch = () => {
            return(
                <div>Sorry..No Match!</div>
            )
        }

        return(
            <div className={"forum"}>
               <Switch>
                    <Route exact path={`${URL}`} 
                        render={(props) => 
                            <ForumRoot categories={this.state.forumCategories} match={this.props.match} />}
                    />
                    {routeElements}
                    <Route component={NoMatch}/>
               </Switch>
            </div>   
        )
    }
}

export default Forum;