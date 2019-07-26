import React, { Component } from "react";
import Search from "./components/search/search.component";
import Table from "./components/table/table.component";
import Button from "./components/button/button.component";
import Loading from "./components/loading/loading.component";
import { Api } from "./api";
import { updateSearchTopStoriesState } from './utilities';
import "./App.css";

const endpoint = `${Api.PATH_BASE}${Api.PATH_SEARCH}?${Api.PARAM_SEARCH}`;

class App extends Component {
  /**
   * Mounting Process has 4 Lifecycle Methods:  
   *  • constructor()
      • getDerivedStateFromProps()
      • render()
      • componentDidMount()
   * 
   */
  constructor(props) { //called when the component gets initialized.
    super(props);

    this.state = {
      results: null,
      searchKey: '', //need it to cache results
      searchTerm: Api.DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };

    //The binding step is necessary because class methods don’t automatically bind this to the class instance.
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  //check if it is the first search with the request "key" or we can use a "cached search"
  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    this.setState(updateSearchTopStoriesState(hits, page));
  }

  async fetchSearchTopStories(searchTerm, page = 0) {

    this.setState({ isLoading: true });
    
    /* axios(`${endpoint}${searchTerm}&${Api.PARAM_PAGE}${page}&${Api.PARAM_HPP}${Api.DEFAULT_HPP}`)
    .then(result => this.setSearchTopStories(result.data))
    .catch(error => this.setState({ error }));  */

    try {
      const response = await fetch(`${endpoint}${searchTerm}&${Api.PARAM_PAGE}${page}&${Api.PARAM_HPP}${Api.DEFAULT_HPP}`);
      const result = await response.json();
      this.setSearchTopStories(result);
    } catch(error) {
      this.setState({ error });
    }
     
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }
  
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }
  
  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if(this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }

    event.preventDefault();
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const updatedHits = hits.filter(item => item.objectID !== id);
    //update the State using this.setState() class method
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  /* 
    Each time the state or the props of a component changes, the render() method is
    called. 
  */
  render() {
    const { searchTerm, results, searchKey, error, isLoading } = this.state; //ES6 Destructuring
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      /**
       * Attention:
       * input, like textarea and select
       * are called "uncontrolled component"
       * In React we need to control them!
       * so we use value={searchTerm}
       */
      <div className="page">
        <h1 className="page-title">HKRNews</h1>
        <div className="interactions">
          <Search 
            value={searchTerm} 
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        

        { 
          error
          ? <div className="interactions">
              <p>Something went wrong fetching data. Sorry!</p>
            </div>
          : <Table 
              list={ list }
              onDismiss={ this.onDismiss } 
            />
         }


        <div className="interactions">
           <ButtonWithLoading
            isLoading={isLoading}
            onClick={ () => this.fetchSearchTopStories(searchKey, page + 1) }
          >
            More
           </ButtonWithLoading> 
        </div>  
        

      </div>
    );
  }
}

/**
 *This is a so called HOC Higher Order Component it takes a component as an input 
  and return a component as output. Based on isLoading State it will output 
  the Loading component or the More button (the input)  
 */
const withLoading = (Component) => ({ isLoading, ...rest }) => 
  isLoading 
    ? <Loading /> 
    : <Component { ...rest } />;

const ButtonWithLoading = withLoading(Button);

export default App;
