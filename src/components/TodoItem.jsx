import { SquarePen, X } from 'lucide-react'
import { useState } from 'react'

export function TodoItem({ todo, todos, setTodos }) {
	// Какой todo сейчас редактируется
	const [editingTodoId, setEditingTodoId] = useState(null)

	// Текст в поле редактирования
	const [editedText, setEditedText] = useState('')

	// Удаление одной задачи
	const handleDeleteTodo = () => {
		setTodos(prevTodos => prevTodos.filter(item => item.id !== todo.id))
	}

	// Переключение статуса выполнения
	const handleToggleCompleted = () => {
		setTodos(prevTodos =>
			prevTodos.map(item =>
				item.id === todo.id ? { ...item, isCompleted: !item.isCompleted } : item
			)
		)
	}

	// Начать редактирование задачи
	const handleStartEdit = () => {
		setEditingTodoId(todo.id)
		setEditedText(todo.text)
	}

	// Сохранить новое значение задачи
	const handleSaveEdit = () => {
		const trimmedText = editedText.trim()

		// Если после обрезки пусто — просто выходим из режима редактирования
		if (trimmedText === '') {
			setEditingTodoId(null)
			setEditedText('')
			return
		}

		setTodos(prevTodos =>
			prevTodos.map(item => {
				if (item.id === todo.id) {
					return {
						...item,
						text: trimmedText
					}
				}
				return item
			})
		)

		setEditingTodoId(null)
		setEditedText('')
	}

	// Клавиши во время редактирования
	const handleEditKeyDown = event => {
		if (event.key === 'Escape') {
			setEditingTodoId(null)
			setEditedText('')
		}

		if (event.key === 'Enter') {
			handleSaveEdit()
		}
	}

	const isEditing = editingTodoId === todo.id

	return (
		<li className="todo-item">
			<button
				className="todo-item__edit-button"
				type="button"
				aria-label="Edit task"
				onClick={handleStartEdit}
			>
				<SquarePen size={18} />
			</button>

			<div className="todo-item__content">
				<input
					type="checkbox"
					className="todo-item__checkbox"
					checked={todo.isCompleted}
					onChange={handleToggleCompleted}
				/>

				{isEditing ? (
					<input
						type="text"
						value={editedText}
						onChange={event => setEditedText(event.target.value)}
						onBlur={() => {
							if (todo.text.trim() === editedText.trim()) {
								setEditingTodoId(null)
								setEditedText('')
								return
							}

							handleSaveEdit()
						}}
						onKeyDown={handleEditKeyDown}
						autoFocus
						className="todo-item__input"
					/>
				) : (
					<p
						className={`todo-item__text ${
							todo.isCompleted ? 'todo-item__text--completed' : ''
						}`}
					>
						{todo.text}
					</p>
				)}
			</div>

			<button
				className="todo-item__delete-button"
				type="button"
				aria-label="Delete task"
				onClick={handleDeleteTodo}
			>
				<X size={18} />
			</button>
		</li>
	)
}
