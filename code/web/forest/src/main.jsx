import React from "react";
import ReactDOM from "react-dom/client";
import {
	BrowserRouter as Router,
	Route,
	Routes,
} from "react-router-dom";
import App from "./App";
import About from "./About";

import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Router>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/about" element={<About />} />
			</Routes>
		</Router>
	</React.StrictMode>
);
