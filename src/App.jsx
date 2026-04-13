import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { TodoItem } from './components/TodoItem'

function App() {
	// Состояние поля ввода новой задачи
	const [inputValue, setInputValue] = useState('')

	// Список задач. При первом рендере пробуем загрузить из localStorage
	const [todos, setTodos] = useState(() => {
		try {
			const savedTodos = localStorage.getItem('todos')
			return savedTodos ? JSON.parse(savedTodos) : []
		} catch (error) {
			return []
		}
	})

	// Текст ошибки под инпутом
	const [errorMessage, setErrorMessage] = useState('')

	// Текущее состояние фильтра: all / active / completed
	const [filter, setFilter] = useState('all')

	// Добавление задачи по Enter
	const handleInputKeyDown = event => {
		if (event.key === 'Enter') {
			handleAddTodo()
		}
	}

	// Добавление новой задачи
	const handleAddTodo = () => {
		const trimmedValue = inputValue.trim()

		if (trimmedValue === '') {
			setErrorMessage(
				'Oops! You forgot to write the task. What would you like to add?'
			)
			return
		}

		const newTodo = {
			id: Date.now().toString(36) + Math.random().toString(36).slice(2),
			text: trimmedValue,
			isCompleted: false
		}

		setTodos(prevTodos => [...prevTodos, newTodo])
		setInputValue('')
		setErrorMessage('')
	}

	// Удаление всех выполненных задач
	const handleClearCompleted = () => {
		setTodos(prevTodos => prevTodos.filter(todo => !todo.isCompleted))
	}

	// Смена фильтра
	const handleFilterChange = event => {
		setFilter(event.target.value)
	}

	// Отфильтрованный список задач для отображения
	let visibleTodos = todos

	if (filter === 'active') {
		visibleTodos = todos.filter(todo => !todo.isCompleted)
	} else if (filter === 'completed') {
		visibleTodos = todos.filter(todo => todo.isCompleted)
	}

	// Сохраняем задачи в localStorage при каждом изменении
	useEffect(() => {
		localStorage.setItem('todos', JSON.stringify(todos))
	}, [todos])

	// Количество невыполненных задач
	const remainingTodosCount = todos.filter(todo => !todo.isCompleted).length

	return (
		<main className="app">
			<h1 className="app__title">
				Arionel <span>Todo</span>
			</h1>

			<section className="todo">
				{/* Верхняя панель: поле ввода и кнопка добавления */}
				<div className="todo__toolbar">
					<input
						type="text"
						className="todo__input"
						placeholder="Add new task"
						value={inputValue}
						onChange={event => setInputValue(event.target.value)}
						onKeyDown={handleInputKeyDown}
					/>

					<button
						className="todo__add-button"
						type="button"
						aria-label="Add task"
						onClick={handleAddTodo}
					>
						<Plus />
					</button>
				</div>

				{/* Блок ошибки */}
				<div className="todo__error">
					{errorMessage && <p className="todo__error-text">{errorMessage}</p>}
				</div>

				{/* Управление фильтром и очисткой выполненных */}
				<div className="todo__controls">
					<select
						name="filter"
						className="todo__filter"
						value={filter}
						onChange={handleFilterChange}
					>
						<option value="all">All</option>
						<option value="active">Active</option>
						<option value="completed">Completed</option>
					</select>

					<button
						className="todo__clear-button"
						type="button"
						onClick={handleClearCompleted}
					>
						Clear completed
					</button>
				</div>

				{/* Список задач */}
				<div className="todo__list-wrapper">
					<ul className="todo__list">
						{visibleTodos.map(todo => (
							<TodoItem
								key={todo.id}
								todo={todo}
								todos={todos}
								setTodos={setTodos}
							/>
						))}
					</ul>
				</div>

				{/* Счетчик оставшихся задач */}
				<p className="todo__counter">
					Tasks remaining:{' '}
					<span className="todo__counter-value">{remainingTodosCount}</span>
				</p>
			</section>
		</main>
	)
}

export default App
