import React from "react";
import "./search.styles.css";

class Search extends React.Component {

  componentDidMount() {
    if(this.input) {
      this.input.focus(); //it triggers the focus when the app renders
    }
  }

  render() {
    const { value, onChange, onSubmit, children } = this.props;
    
    return (
      <form onSubmit={ onSubmit }>
        <input 
          type="text" 
          value={value} 
          onChange={onChange}
          ref={el => this.input = el} 
        />
        <button type="submit">
          { children }
        </button>
      </form>
    );
  }

}

export default Search;
