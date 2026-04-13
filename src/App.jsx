import { Plus, SquarePen, X } from 'lucide-react'
import { useEffect, useState } from 'react'

function App() {
	const [input, setInput] = useState('')
	const [todos, setTodos] = useState(() => {
		const savedTodos = localStorage.getItem('todos')
		return savedTodos ? JSON.parse(savedTodos) : []
	})
	const [error, setError] = useState('')
	const [select, setSelect] = useState('all')
	const [EditingId, setEditingId] = useState(null)
	const [text, setText] = useState('')

	const handleKeyDown = event => {
		if (event.key === 'Enter') {
			handleAddTodo()
		}
	}

	const handleKeyDownEditing = event => {
		if (event.key === 'Escape') {
			setEditingId(null)
		} else if (event.key === 'Enter') {
			saveEdit(EditingId)
		}
	}

	const handleAddTodo = () => {
		if (input.trim() !== '') {
			const todoObj = {
				id: Date.now().toString(36) + Math.random().toString(36).slice(2),
				text: input.trim(),
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

	const clearAllCompleted = () => {
		setTodos(todos.filter(todo => !todo.isCompleted))
	}

	const handleSelect = event => {
		setSelect(event.target.value)
	}

	const startEdit = todo => {
		setEditingId(todo.id)
		setText(todo.text)
	}

	const saveEdit = id => {
		if (text.trim() === '') return
		setTodos(
			todos.map(todo => {
				if (todo.id === id) {
					return {
						...todo,
						text: text
					}
				}
				return todo
			})
		)
		setEditingId(null)
	}

	let visibleTodos = todos

	if (select === 'active') {
		visibleTodos = visibleTodos.filter(todo => !todo.isCompleted)
	}

	if (select === 'completed') {
		visibleTodos = visibleTodos.filter(todo => todo.isCompleted)
	}

	useEffect(() => {
		localStorage.setItem('todos', JSON.stringify(todos))
	}, [todos])

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
						value={select}
						onChange={handleSelect}
					>
						<option value="all">All</option>
						<option value="active">Active</option>
						<option value="completed">Completed</option>
					</select>

					<button
						className="clear-btn"
						type="button"
						onClick={clearAllCompleted}
					>
						Clear Completed
					</button>
				</div>

				<div className="list">
					<ul className="todo-list">
						{visibleTodos.map(todo => (
							<li
								className="todo-item"
								key={todo.id}
							>
								<button
									className="todo-change"
									onClick={() => startEdit(todo)}
								>
									<SquarePen />
								</button>
								<div className="todo-item-box">
									<input
										type="checkbox"
										className="item-checkbox"
										checked={todo.isCompleted}
										onChange={() => {
											handleToggleCheck(todo.id)
										}}
									/>
									{EditingId === todo.id ? (
										<input
											type="text"
											value={text}
											onChange={e => setText(e.target.value)}
											onBlur={() =>
												todo.text === text
													? setEditingId(null)
													: saveEdit(todo.id)
											}
											onKeyDown={handleKeyDownEditing}
											autoFocus
											className="change"
										/>
									) : (
										<p
											className={`todo__item-text ${todo.isCompleted ? 'completed' : ''}`}
										>
											{todo.text}
										</p>
									)}
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
