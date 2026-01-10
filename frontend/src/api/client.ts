// frontend\src\api\client.ts

// 優先讀取環境變數，如果沒有則使用 localhost (開發用)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem("token")

    // 定義基礎 headers，明確宣告為鍵值對都必須是字串
    const headers: Record<string, string> = {
        "Content-Type": "application/json"
    }

    // 如果有 token，才將 Authorization 加入物件中
    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    return headers
}

// 登入 API
export const loginUser = async (username: string, password: string) => {
    // OAuth2 規範要求使用 form-urlencoded 格式
    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)

    const res = await fetch(`${API_URL}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
    })

    if (!res.ok) throw new Error("Login failed")

    return res.json() // 回傳 { access_token: "...", token_type: "bearer" }
}

// 註冊 API
export const registerUser = async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
        // 嘗試讀取後端回傳的錯誤訊息 (例如： Username already registered)
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || "Registeration failed")
    }

    return res.json()
}

// 取得當前使用者資訊
export const getCurrentUser = async () => {
    const res = await fetch(`${API_URL}/users/me`, {
        headers: getAuthHeaders(),
    })

    if (!res.ok) throw new Error("Failed to get current user")

    return res.json()
}

// 更新使用者資訊
export const updateUser = async (userUpdate: { display_name?: string, avatar?: string }) => {
    const res = await fetch(`${API_URL}/users/me`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(userUpdate),
    })

    if (!res.ok) throw new Error("Failed to update user")

    return res.json()
}

// 獲取 Todos (帶上 Token)
export const getTodos = async () => {
    try {
        const res = await fetch(`${API_URL}/todos/`, {
            headers: getAuthHeaders() // 加入 Header
        })

        // 如果後端回傳 401 (未登入) 或其他錯誤，回傳空陣列，不要讓程式崩潰
        if (res.status === 401) return [] // 未登入回傳空
        if (!res.ok) {
            console.warn("API Error:", res.status, res.statusText)
            return []
        }

        return res.json()
    } catch(error) {
        console.error("Network Error:", error)
        return []
    }
}

// 建立 Todo (帶上 Token)
export const createTodo = async (title: string) => {
    const res = await fetch(`${API_URL}/todos/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, completed: false }),
    })

    if (!res.ok) throw new Error("Failed to create todo")

        return res.json()
}

// 更新 Todo (用於修改標題或切換完成狀態)
export const updateTodo = async (id: number, todo: { title?: string, completed?: boolean, order?: number }) => {
    const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(todo),
    })

    if (!res.ok) throw new Error("Failed to update todo")

    return res.json()
}

// 刪除 Todo
export const deleteTodo = async (id: number) => {
    const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    })

    if (!res.ok) throw new Error("Failed to delete todo")

    return res.json() // 後端回傳 { ok: true }
}

// 重新排序 Todos
export const reorderTodos = async (todos: { id: number; order: number }[]) => {
    const res = await fetch(`${API_URL}/todos/reorder`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(todos),
    })

    if (!res.ok) throw new Error("Failed to reorder todos")

    return res.json()
}
