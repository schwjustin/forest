export enum Method {
	GET = "GET",
	POST = "POST",
	PUT = "PUT",
	PATCH = "PATCH",
	DELETE = "DELETE",
}

export abstract class CallAPI {
	static async call(
		method: Method,
		url: string,
		body?: any,
		headers: Headers = new Headers()
	) {
		headers.append("Content-Type", "application/json");

		console.log("url: " + url);
		console.log("body: " + body);

		return fetch(url, {
			method: method,
			mode: "cors",
			headers: headers,
			body: JSON.stringify(body),
		})
			.then(async (response): Promise<any> => {
				console.log("status: " + response.status);
				return response.text();
			})
			.then((text): any => {
				try {
					const data = JSON.parse(text);
					console.log(data);
					return data;
				} catch (err) {
					console.log(text);
					return text;
				}
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}
}
