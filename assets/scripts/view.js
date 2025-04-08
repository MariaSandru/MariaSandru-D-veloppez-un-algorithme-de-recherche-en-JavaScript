import { recipes } from "./data/recipes.js"
import { cardTemplate } from "./function/cardTemplate.js"
import Dropdown from "./filters/Dropdown.js"

export class View {
    constructor() {
        this.selectedIngredientsList = []
        this.selectedApplianceList = []
        this.selectedUstensilsList = []

        /**
         * afficher les recettes
         */
        this.displayRecipes(recipes, this.createCardRecipe)

        /**
         * afficher les filtres
         */
        this.getDropDowns()

        /**
         * barre de recherche
         */
        this.searchInputIndex()
    }

    /**
     * créer carte de recette
     * @param recipe
     * @returns {*}
     */
    createCardRecipe(recipe) {
        return cardTemplate(recipe)
    }

    /**
     * créer les dropdowns
     */
    getDropDowns() {
        let dropdownIngredient = new Dropdown("Ingredients",(type, selectedText, isRemoving) => {this.updateSelectedItems(type, selectedText, isRemoving)})
        dropdownIngredient.createDropDown(this)
        let dropdownAppliance = new Dropdown("Appareil",(type, selectedText, isRemoving) => {this.updateSelectedItems(type, selectedText, isRemoving)})
        dropdownAppliance.createDropDown(this)
        let dropdownUstensils = new Dropdown("Ustensils",(type, selectedText, isRemoving) => {this.updateSelectedItems(type, selectedText, isRemoving)})
        dropdownUstensils.createDropDown(this)
    }

    /**
     * fonctionne pour mettre a jour les item sélectionner
     * @param type
     * @param selectedText
     * @param isRemoving
     */
    updateSelectedItems(type, selectedText, isRemoving = false) {
        if (!isRemoving) {
            switch (type) {
                case "Ingredients":
                    this.selectedIngredientsList.push(selectedText)
                    break
                case "Appliances":
                    this.selectedApplianceList.push(selectedText)
                    break
                case "Ustensils":
                    this.selectedUstensilsList.push(selectedText)
                    break
            }
        } else {
            switch (type) {
                case "Ingredients":
                    this.selectedIngredientsList = this.selectedIngredientsList.filter((text) => text !== selectedText)
                    break
                case "Appliances":
                    this.selectedApplianceList = this.selectedApplianceList.filter((text) => text !== selectedText)
                    break
                case "Ustensils":
                    this.selectedUstensilsList = this.selectedUstensilsList.filter((text) => text !== selectedText)
                    break
            }
        }

        console.log('Ingredients List:', this.selectedIngredientsList)
        console.log('Appliances List:', this.selectedApplianceList)
        console.log('Ustensils List:', this.selectedUstensilsList)

        // lancer vers la fonction qui s'occupe des filtres
        this.filterRecipes()
    }

    /**
     * Afficher les recettes
     * @param recipes
     * @param createCardRecipe
     */
    displayRecipes(recipes, createCardRecipe) {
        const recipesContainer = document.getElementById("recipe-container")

        // afficher un message si y a 0 recettes
        if (recipes.length === 0) {
            recipesContainer.innerHTML =
                `
                    <div class="noRecipeMessage">
                        <img class="imgNoRecipe" src="assets/img/svg/noResult.svg" alt="image qui affiche aucun résultats">
                        <p class="message">Aucune recette ne correspond à votre recherche.</p>
                    </div>
                `
        } else {
            // vider l'HTML
            recipesContainer.innerHTML = ""

            // boucle recettes
            recipes.forEach(recipe => {
                const recipeElement = createCardRecipe(recipe)
                recipesContainer.appendChild(recipeElement)
            })
        }

        this.showNumberRecipes(recipes)
    }

    filterRecipes() {
        let filteredRecipes = recipes

        filteredRecipes = this.filteredByIngredients(filteredRecipes)
        filteredRecipes = this.filteredByAppliance(filteredRecipes)
        filteredRecipes = this.filteredByUstensils(filteredRecipes)
        filteredRecipes = this.filteredBySearchInput(filteredRecipes)

        // afficher les recettes filtrées
        this.displayRecipes(filteredRecipes, this.createCardRecipe)
    }

    filteredByIngredients(filteredRecipes) {
        if (this.selectedIngredientsList.length > 0) {
            return filteredRecipes.filter(recipe =>
                this.selectedIngredientsList.every(ingredient =>
                    recipe.ingredients.some(recIng => recIng.ingredient.includes(ingredient))
                )
            )
        }
        return filteredRecipes
    }

    filteredByAppliance(filteredRecipes) {
        // je filtre par appareil
        if (this.selectedApplianceList.length > 0) {
            filteredRecipes = filteredRecipes.filter(recipe =>
                this.selectedApplianceList.includes(recipe.appliance)
            )
        }

        return filteredRecipes
    }

    filteredByUstensils(filteredRecipes) {
        // je filtre par ustensiles
        if (this.selectedUstensilsList.length > 0) {
            filteredRecipes = filteredRecipes.filter(recipe =>
                this.selectedUstensilsList.every(ustensil =>
                    recipe.ustensils.includes(ustensil)
                )
            )
        }

        return filteredRecipes
    }

    filteredBySearchInput(filteredRecipes) {
        const searchQuery = this.searchQuery?.toLowerCase() || ""
        const result = []

        if (searchQuery.length >= 3) {
            for (let i = 0; i < filteredRecipes.length; i++) {
                const recipe = filteredRecipes[i]
                if (
                    recipe.name.toLowerCase().includes(searchQuery) ||
                 
                    recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchQuery)) 
                    
                );
                 {
                    result.push(recipe)
                }
            }
        } else {
            return filteredRecipes
        }

        return result
    }



    /**
     * afficher le nombre de recettes
     * @param recipes
     */
    showNumberRecipes(recipes) {
        const numberDiv = document.querySelector('.numberFound')

        if (numberDiv) {
            numberDiv.textContent = `${recipes.length} Recettes`
        }
    }

    searchInputIndex() {
        const searchInputIndex = document.querySelector('.searchBar__input')

        searchInputIndex.addEventListener('input', (event) => {
            const inputValue = event.target.value

            if (inputValue.length >= 3) {
                this.searchQuery = inputValue
            } else {
                this.searchQuery = ""
            }

            this.filterRecipes()
        })
    }

   
}