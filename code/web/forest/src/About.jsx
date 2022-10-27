import React, { useState, useEffect } from "react";
import useComponentVisible from "./utils/useComponentVisible";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import countries from "./data/countries.json";
import forests from "./data/annual-change-forest-area.json";
import { Link } from "react-router-dom";

import bg from "./assets/images/test.jpg";

function App() {
	return (
		<div
			className="flex w-full h-full relative"
			style={{
				background: `black url(${bg}) no-repeat center center`,
				backgroundSize: "cover",
			}}
		>
			

			<div className="ml-auto mr-auto box-border pl-3 pr-3 max-w-screen-md mt-[120px] z-10">
				<h2>See into the future of our planet.</h2>
				<p>
					Terrestrial uses stable diffusion and natural language models from
					NVIDIA and OpenAl to give you a peek into the effects of
					deforestation, years into our planet's future.
				</p>

				<h2>Natural Language and Al Generated Images.</h2>
				<p>
					All images seen on terrestrial are Al generated; they are not captured
					by humans. <br />
					Natural Language models take raw data to create uniform query
					optimized prompts the prompts are fed to a stable diffusion model
					producing an entirely unique image.
				</p>
			</div>

			{/* <div className="fixed top-0 w-full h-1/3 bg-gradient-to-b to-transparent from-black-40 pointer-events-none"></div> */}

			<div className="w-full h-full fixed backdrop-blur-xl"></div>

			<h1 className="fixed top-7 left-7 font-semibold text-2xl">Terrestrial</h1>

			<Link
				to="/"
				className="leading-8 fixed top-7 right-7 text-m cursor-pointer font-semibold"
			>
				Home
			</Link>
		</div>
	);
}

export default App;
