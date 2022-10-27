import React, { useState, useEffect } from "react";
import useComponentVisible from "./utils/useComponentVisible";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import countries from "./data/countries.json";
import forests from "./data/annual-change-forest-area.json";
import { Link } from "react-router-dom";

import bg from "./assets/images/test.jpg";

function App() {
	const [query, setQuery] = useState("");
	const [bgInfo, setBgInfo] = useState("Amazon Rainforest, Brazil\n2030");
	const [results, setResults] = useState([]);
	const [searchRef, search, setSearch] = useComponentVisible(false);
	const [yearsRef, years, setYears] = useComponentVisible(false);

	const filter = async (e) => {
		const word = e.target.value;

		if (word !== "") {
			const res = countries.filter((country) => {
				return country.toLowerCase().startsWith(word.toLowerCase());
			});
			setResults(res);
		} else {
			setResults([]);
		}

		setQuery(word);
	};

	return (
		<div
			className="flex w-full h-full relative"
			style={{
				background: `black url(${bg}) no-repeat center center`,
				backgroundSize: "cover",
			}}
		>
			Test
		</div>
	);
}

export default App;
