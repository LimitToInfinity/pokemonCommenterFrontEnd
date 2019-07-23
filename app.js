let selectedPokemon = "25"
let allComments = []

const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`
const commentsUrl = `http://localhost:3000/comments`

const $img = document.querySelector(".pokemon-image")
const $name = document.querySelector(".pokemon-name")
const $comments = document.querySelector(".comments")
const $form = document.querySelector(".add-comment")
const $filterText = document.querySelector(".filter-text")

fetch(pokemonUrl)
.then(parseJson)
.then(setPokemon)

fetch(commentsUrl)
.then(parseJson)
.then(comments => {
    allComments = comments
    comments
    .filter(isSelectedPokemon)
    .map(createCommentElement)
    .map(addDeleteButton)
    .forEach(displayComment)
})

function isSelectedPokemon(comment){
    return comment.item_id == selectedPokemon
}

function createCommentElement(comment){
    const $comment = document.createElement("li")
    $comment.class = "comment"
    $comment.textContent = comment.content
    $comment.value = comment.id
    
    return $comment
}

function addDeleteButton($comment) {
    const deleteButton = document.createElement("button")
    deleteButton.class = "delete-button"
    deleteButton.textContent = "X"
    $comment.appendChild(deleteButton)
    
    return $comment
}

function displayComment($comment){
    $comments.appendChild($comment)
}

deleter()

function deleter(){
    $comments.addEventListener("click", (event) => {
    const $comment = event.target.parentNode
    fetch(`http://localhost:3000/comments/${$comment.value}`, {
    method: "DELETE"
    }).then($comment.remove())
    })
}

$filterText.addEventListener("input", event => {
    removeAllComments()
    
    allComments
    .filter(isSelectedPokemon)
    .filter(matchesFilterText)
    .map(createCommentElement)
    .map(addDeleteButton)
    .forEach(displayComment)
})

function matchesFilterText(comment){
    return comment.content.toLowerCase()
        .includes(event.target.value.toLowerCase())
}

function removeAllComments() {
    while($comments.hasChildNodes()) {
        $comments.removeChild($comments.firstChild)
    }
}

$form.addEventListener("submit", event => {
    event.preventDefault()
    
    const formData = new FormData(event.target)

    let comment = {
        item_id: selectedPokemon,
        content: formData.get("content")
    }

    event.target.reset()
    
    postNewComment(comment)
    .then(parseJson)
    .then(json => {
        return {
            id: json.id,
            item_id: json.item_id,
            content: json.content
        }
    }).then(createCommentElement)
    .then(addDeleteButton)
    .then(displayComment)
})

function postNewComment(comment){
    return fetch(commentsUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(comment)
    })
}
    
function capitalize(string){
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function parseJson(response){
    return response.json()
}

function setPokemon(pokemon){
        $img.src = pokemon.sprites.front_default
        $name.innerText = capitalize(pokemon.name)
}