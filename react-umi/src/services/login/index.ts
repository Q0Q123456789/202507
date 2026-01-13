import { request } from '@umijs/max'
// 登录
export async function login(params: { username: string; password: string }) {
	return request<API.Result_Login_>('/api/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		data: params
	})
}
// 注册
export async function register(params: { username: string; password: string }) {
	return request<API.Result_Login_>('/api/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		data: params
	})
}
// 退出登录
export async function logout() {
	return request<API.Result_Login_>('/api/logout', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}
