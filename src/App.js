import React, { Component } from 'react';
import './App.css';

const SelectRecipe = (props) => {
  let style1 = 'Add Recipe' === props.selectedRecipe ? {marginBottom: '-1px'} : null,
	  style2 = 'Edit' === props.action ? {pointerEvents: 'none'} : null;
	
  return (
    <ul className='recipes'>
      <li
        className='add-recipe-tab'
        style={Object.assign({}, style1, style2)}
        onClick={props.onSelect.bind(null, 'Add', 'Add Recipe')}>
        Add Recipe
      </li>
      {props.recipeBook.map( (recipe) => {
        return (
          <li
            className='recipe-tab'
            style={recipe['title'] === props.selectedRecipe ? {marginBottom: '-1px'} :null }
            onClick={props.onSelect.bind(null, null, recipe['title'])}>
            {recipe['title']}
          </li>
        )
      })}
    </ul>
  )
}

const RecipePage = (props) => {
  let recipePage = '',
      recipeStyle = 'recipe-folder';
	  
  if (props.selectedRecipe !== 'Add Recipe') {
     recipePage = props.recipeBook.map( (recipe) => {
      return recipe
    }).filter( (recipe) => {
      return recipe['title'] === props.selectedRecipe
    });
	recipeStyle = 'recipe-page'
  }
  
  return (
    <div className={recipeStyle}
         style={props.action === 'Edit' ? {background: '#f8ecc2'} : null}>
      {props.children}
      {(props.selectedRecipe !== 'Add Recipe' && !props.action)  && 
        <div className='recipe-content'>
          <h3>
            Ingredients
          </h3>
          <ul className='recipe-ingredients'>
            {recipePage[0]['ingredients'].map( (ingredient) => {
              return <li>{ingredient}</li>
            })}
          </ul>
          <div className='recipe-buttons'>
            <p
              onClick={props.onAction.bind(null, 'Edit')}>
              Edit
            </p> 
            <p
              onClick={props.onDelete.bind(null, props.selectedRecipe)}>
              Delete
            </p>
          </div>
        </div>}
    </div>
  )
}

const RecipeOverlay = (props) =>  {
  let recipeName = '',
      recipeIndex = '',
      ingredients = '';
	  
  if (props.action === 'Edit') {
    recipeName = props.selectedRecipe;
    recipeIndex = props.recipeBook.findIndex( (recipe) => {
      return recipe['title'] === props.selectedRecipe
    });
    ingredients = props.recipeBook.map( (recipe) => {
      return recipe
    }).filter( (recipe) => {
      return recipe['title'] === recipeName
    })[0]['ingredients'].reduce( (arr, val) => {
      return arr + ',' + val
    });
  } 
  
   return (
     <div>
       <div>
         <h3>{props.action} a Recipe</h3>
         <hr/>
         <h5>Recipe</h5>
         <textarea id='recipeTitle' placeholder='Enter Recipe Name'>
           {recipeName}
         </textarea>
         <h5>Ingredients</h5>
         <textarea id='recipeIngredients' placeholder='Enter Ingredients'>
           {ingredients}
         </textarea>
       </div>
       <div className='button-grouping'>
         {props.action === 'Add' &&
           <p
             onClick={props.onAdd.bind(null, props.recipeBook)}>
             Add Recipe
         </p>}
         {props.action === 'Edit' &&
           <p
             onClick={props.onEdit.bind(null, props.recipeBook, recipeIndex)}>
             Edit Recipe
         </p>}
         {props.action === 'Edit' &&
          <p
           onClick={props.onAction.bind(null, null)}>
         Cancel
         </p>}
       </div>
     </div>
   )
}

class RecipeBook extends Component {
  constructor(props) {
    super(props);
	
    if (!localStorage.jcsonofashepherd_recipes) {
      localStorage.setItem('jcsonofashepherd_recipes', '[{"title":"Soup","ingredients":["Water","Carrots","Salt"]},{"title":"Ice","ingredients":["Water","Cold Temperature","Electricity"]},{"title":"Rice","ingredients":["Rice","Water"]}]');
    }
	
    this.state = {
      selectedRecipe: 'Add Recipe',
      recipeBook: JSON.parse(localStorage.jcsonofashepherd_recipes),
      action: 'Add'
    };
	
    this.addRecipe = this.addRecipe.bind(this);
    this.editRecipe = this.editRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
    this.updateRecipe = this.updateRecipe.bind(this);
    this.updateAction = this.updateAction.bind(this);
    this.updateActionAndRecipe = this.updateActionAndRecipe.bind(this);
  }
  
  componentDidMount() {
    this.updateRecipe(this.state.selectedRecipe);
  }
  
  addRecipe(oldRecipeBook) {
    let recipeTitle = !document.getElementById('recipeTitle') ?
                     '':document.getElementById('recipeTitle').value,
        recipeIngredients = !document.getElementById('recipeIngredients') ?
                     '':document.getElementById('recipeIngredients').value,
        newRecipe = JSON.parse('[{"title":"' + 
                     recipeTitle +
                    '","ingredients":' +
                     JSON.stringify((recipeIngredients).split(",")) +
                    "}]"),
        recipeBook = (oldRecipeBook).concat(newRecipe);
    localStorage.setItem('jcsonofashepherd_recipes', JSON.stringify(recipeBook));
    this.setState( () => {
      return {
        selectedRecipe: recipeBook[recipeBook.length-1]['title'],
        recipeBook: recipeBook,
        action: null
      }
    })
  }
  
  editRecipe(oldRecipeBook, recipeIndex) {
    let recipeTitle = document.getElementById('recipeTitle').value,
        recipeIngredients = document.getElementById('recipeIngredients').value.split(","),
        recipeBook = oldRecipeBook;
    recipeBook[recipeIndex]['title'] = recipeTitle;
    recipeBook[recipeIndex]['ingredients'] = recipeIngredients;
    localStorage.setItem('jcsonofashepherd_recipes', JSON.stringify(recipeBook));
    this.setState( () => {
      return {
        selectedRecipe: recipeBook[recipeIndex]['title'],
        recipeBook: recipeBook,
        action: null
      }
    })    
  }
  
  deleteRecipe(recipeTitle) {
    let recipeBook = this.state.recipeBook.filter( (recipe) => {
      return recipe['title'] !== recipeTitle 
    })
    localStorage.setItem('jcsonofashepherd_recipes', JSON.stringify(recipeBook))
    this.setState( () => {
      return {
        selectedRecipe: 'Add Recipe',
        recipeBook: recipeBook,
        action: 'Add'
      }
    })
  }
  
  updateAction(action) {
    this.setState( () => {
      return {
        action: action
      }
    })
  }
  
  updateRecipe(recipe) {
    this.setState( () => {
      return {
        selectedRecipe: recipe,
      }
    })
  }
  
  updateActionAndRecipe(action, recipe) {
    this.updateAction(action)
    this.updateRecipe(recipe)
  }
  
  render() {
    return (
      <div>
        <SelectRecipe
          selectedRecipe={this.state.selectedRecipe}
          recipeBook={this.state.recipeBook}
          action={this.state.action}
          onSelect={this.updateActionAndRecipe}
          onAction={this.updateAction}
          />
        <RecipePage
          selectedRecipe={this.state.selectedRecipe}
          recipeBook={this.state.recipeBook}
          action={this.state.action}
          onDelete={this.deleteRecipe}
          onAction={this.updateAction}
          >
        {this.state.action &&
        <RecipeOverlay
          selectedRecipe={this.state.selectedRecipe}
          recipeBook={this.state.recipeBook}
          action={this.state.action}
          onAdd={this.addRecipe}
          onEdit={this.editRecipe}
          onAction={this.updateAction}
          />}
        </RecipePage>
      </div>
    )
  } 
}

class App extends Component {
  render() {
    return (
      <div>
        <RecipeBook />
      </div>
    )
  }
}

export default App;
