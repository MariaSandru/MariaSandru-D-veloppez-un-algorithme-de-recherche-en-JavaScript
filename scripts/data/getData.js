import { recipes } from "./recipes.js"

/**
 * Récupérer la liste unique des ingrédients
 * @returns {any[]}
 */
export function getIngredients() {
    const ingredientsSet = new Set()

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            ingredientsSet.add(ingredient.ingredient)
        })
    })

    return Array.from(ingredientsSet)
}

/**
 * Récupérer la liste unique des appareils
 * @returns {any[]}
 */
export function getAppareil() {
    const appareilSet = new Set()

    recipes.forEach(recipe => {
        appareilSet.add(recipe.appliance)
    })

    return Array.from(appareilSet)
}