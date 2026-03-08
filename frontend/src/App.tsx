import { useState } from 'react'

interface Recipe {
  title: string
  ingredients: string[]
  instructions: string[]
  time: string
}

export default function App() {
  const [ingredientInput, setIngredientInput] = useState('')
  const [ingredients, setIngredients] = useState<string[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)

  const addIngredient = () => {
    if (ingredientInput.trim() !== '') {
      setIngredients([...ingredients, ingredientInput.trim()])
      setIngredientInput('')
    }
  }

  const generateRecipes = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate_recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      })
      const data = await response.json()
      setRecipes(data.recipes)
    } catch (error) {
      console.error('Virhe:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Reseptigeneraattori</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
              placeholder="Syötä raaka aine"
              className="flex-1 border p-2 rounded"
            />
            <button 
              onClick={addIngredient}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Lisää
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {ingredients.map((ing, i) => (
              <span key={i} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                {ing}
              </span>
            ))}
          </div>

          <button
            onClick={generateRecipes}
            disabled={ingredients.length === 0 || loading}
            className="w-full bg-green-500 text-white py-3 rounded font-bold disabled:opacity-50"
          >
            {loading ? 'Luodaan reseptejä...' : 'Luo reseptit'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
              <p className="text-gray-600 mb-4">Aika: {recipe.time}</p>
              
              <h3 className="font-semibold mb-2">Ainekset:</h3>
              <ul className="list-disc pl-5 mb-4">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>

              <h3 className="font-semibold mb-2">Ohjeet:</h3>
              <ol className="list-decimal pl-5">
                {recipe.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}