import { Plus, SquarePen, X } from 'lucide-react'
import { useState } from 'react'

function App() {
	const [input, setInput] = useState('')
	const [todos, setTodos] = useState([])
	const [error, setError] = useState('')

	const handleKeyDown = event => {
		if (event.key === 'Enter') {
			handleAddTodo()
		}
	}

	const handleAddTodo = () => {
		if (input.trim() !== '') {
			const todoObj = {
				id: Date.now().toString(36) + Math.random().toString(36).slice(2),
				text: input,
				isCompleted: false
			}
			setTodos([...todos, todoObj])
			setInput('')
			setError('')
		} else {
			setError(
				'Oops! You forgot to write the task. What would you like to add?'
			)
		}
	}

	const todoDel = todosId => {
		setTodos(todos.filter(todo => todo.id !== todosId))
	}

	const handleToggleCheck = id => {
		setTodos(
			todos.map(todo =>
				todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
			)
		)
	}

	return (
		<main className="container">
			<h1 className="main__title">
				Arionel <span>Todo</span>
			</h1>

			<section className="todo-app">
				<div className="toolbar">
					<input
						type="text"
						className="add__input"
						placeholder="Add new task"
						value={input}
						onChange={e => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
					<button
						className="add__btn"
						type="button"
						aria-label="Add task"
						onClick={handleAddTodo}
					>
						<Plus />
					</button>
				</div>
				<div className="error">
					{error && <p className="error-text">{error}</p>}
				</div>
				<div className="controls">
					<select
						name="filter"
						className="filter__todo"
					>
						<option value="all">All</option>
						<option value="active">Active</option>
						<option value="completed">Completed</option>
					</select>

					<button
						className="clear-btn"
						type="button"
						// onClick={clearCompleted}
					>
						Clear Completed
					</button>
				</div>

				<div className="list">
					<ul className="todo-list">
						{todos.map(todo => (
							<li
								className="todo-item"
								key={todo.id}
							>
								<button className="todo-change">
									<SquarePen />
								</button>
								<div className="todo-item-box">
									<input
										type="checkbox"
										className="item-checkbox"
										onChange={() => {
											handleToggleCheck(todo.id)
										}}
									/>
									<p className="todo__item-text">{todo.text}</p>
								</div>
								<button
									className="todo-del"
									onClick={() => todoDel(todo.id)}
								>
									<X />
								</button>
							</li>
						))}
					</ul>
				</div>
				<p className="todos-number">
					Task remaining:{' '}
					<span className="todos-number-span">
						{todos.filter(todo => !todo.isCompleted).length}
					</span>
				</p>
			</section>
		</main>
	)
}

export default App
