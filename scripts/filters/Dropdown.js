import {getItemsList} from "../data/getData.js"

export default class Dropdown {
    constructor(type, callback) {
        this.callback = callback
        this.selectedItem = []
        this.type = type
        this.handleOutsideClick = this.handleOutsideClick.bind(this)
    }

    /**
     * créer le dropdown
     * @param viewInstance
     */
    createDropDown(viewInstance) {
        // récup la div
        const filtersContainer = document.querySelector(".filters")

        // créer un early return
        if (!filtersContainer) return

        // créer un bouton select
        const select = document.createElement("div")
        select.className = "dropdown"

        // créer le dropdown avec une option
        select.innerHTML = `<div class="type">
                                ${this.type}
                                <i class="fa-solid fa-chevron-down"></i>
                            </div>`

        // récupérer la liste des éléments dans un tableau
        const itemsList = getItemsList(this.type)

        // créer une div cachée
        this.hiddenList = document.createElement("div")
        this.hiddenList.className = "hiddenList"

        // créer une ul
        const ulGroupe = document.createElement("ul")

        // boucle pour afficher les items
        this.showItems(itemsList, ulGroupe)

        // append le dropdown à la div
        filtersContainer.appendChild(select).appendChild(this.hiddenList)

        // toggle l'affichage du dropdown
        const typeDiv = select.querySelector(".type")
        typeDiv.addEventListener("click", () => {
            this.toggle()
        })

        // sélectionner la div pour afficher les LI sélectionner
        const selectionDisplay = document.querySelector('.selectionDisplay')

        // créer un itemFilterSelectedDiv conteneur pour tous les items sélectionnés
        this.itemFilterSelectedDiv = document.createElement('div')
        this.itemFilterSelectedDiv.className = 'itemFilterSelectedDiv'
        selectionDisplay.appendChild(this.itemFilterSelectedDiv)

        // rajouter un champ de recherche
        this.createSearchInput(ulGroupe)

        // rajouter un click sur le LI
        this.hiddenList.addEventListener("click", (event) => {
            if (event.target.tagName === 'LI') {
                this.selectItem(event, this.itemFilterSelectedDiv)
            }
        })

    }

/**
     * Créer un champ de recherche
     * @param ulGroupe
     */
createSearchInput(ulGroupe) {
    // créer et configurer le conteneur de recherche
    const searchContainer = this.createSearchContainer()

    // créer l'input de recherche et le bouton de suppression
    const searchInput = this.createSearchInputField(searchContainer)
    const clearButton = this.createClearButton(searchContainer, searchInput)

    // insérer la div de recherche avant les ul
    this.hiddenList.insertBefore(searchContainer, ulGroupe)

    // configurer les événements d'interaction
    this.addSearchInputEvents(searchInput, clearButton, ulGroupe)
    this.addClearButtonEvent(clearButton, searchInput)
}

/**
 * créer le conteneur de recherche et le retourne
 * @returns {HTMLDivElement}
 */
createSearchContainer() {
    const searchContainer = document.createElement('div')
    const searchFlex = document.createElement('div')

    searchContainer.className = 'searchContainer'
    searchFlex.className = 'searchFlex'
    searchContainer.appendChild(searchFlex)

    return searchContainer
}

/**
 * créer l'input de recherche et l'ajoute au conteneur
 * @param searchContainer
 * @returns {HTMLInputElement}
 */
createSearchInputField(searchContainer) {
    const searchInput = document.createElement('input')
    searchInput.className = 'search-input'
    searchInput.placeholder = `Rechercher ${this.type.toLowerCase()}`
    searchContainer.querySelector('.searchFlex').appendChild(searchInput)

    return searchInput
}



}