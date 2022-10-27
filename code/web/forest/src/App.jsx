import React, { useState, useEffect } from "react";
import useComponentVisible from "./utils/useComponentVisible";
import {
	MagnifyingGlassIcon,
	Cross2Icon,
	ChevronDownIcon,
} from "@radix-ui/react-icons";
import countries from "./data/countries.json";
import forests from "./data/annual-change-forest-area.json";
import { Link } from "react-router-dom";

import bg from "./assets/images/amazon.webp";
// import { Dalle } from "dalle-node";

// const dalle = new Dalle("sess-xxxxxxxxxxxxxxxxxxxxxxxxx"); // Bearer Token

import { CallAPI } from "./utils/callAPI";

function App() {
	const [generated, setGenerated] = useState(false);
	const [loading, setLoading] = useState(false);
	const [percent, setPercent] = useState(0);
	const [about, setAbout] = useState(false);
	const [query, setQuery] = useState("");
	const [choice, setChoice] = useState(0);
	const yearArr = ["30", "60", "90", "120", "150"];
	const [bgInfo, setBgInfo] = useState("Amazon Rainforest, Brazil\n2022");
	const [results, setResults] = useState([]);
	const [searchRef, search, setSearch] = useComponentVisible(false);
	const [yearsRef, years, setYears] = useComponentVisible(false);

	// const time = async (x) => {
	// 	if (x === 5) return;
	// 	setTimeout(() => {
	// 		console.log("hello");
	// 		time(x + 1);
	// 	}, 1000);
	// };

	function callme() {
		//This promise will resolve when the network call succeeds
		//Feel free to make a REST fetch using promises and assign it to networkPromise
		var networkPromise = fetch("https://jsonplaceholder.typicode.com/todos/1");

		//This promise will resolve when 2 seconds have passed
		var timeOutPromise = new Promise(function (resolve, reject) {
			// 2 Second delay
			setTimeout(resolve, 2000, "Timeout Done");
		});

		Promise.all([networkPromise, timeOutPromise]).then(function (values) {
			console.log("Atleast 2 secs + TTL (Network/server)");
			console.log(values);
			//Repeat
			callme();
		});
	}

	const call = (input) => {
		console.log(input);
		(async () => {
			const res = countries.filter((country) => {
				return country.toLowerCase() === input.toLowerCase();
			});

			if (res.length > 0) {
				const id = await CallAPI.call(
					"POST",
					"https://3dycapu2p0.execute-api.us-east-1.amazonaws.com/prod/"
				);
				console.log(JSON.stringify(id));
				// setGenerated(true);
				setLoading(true);
				callme();

				// let x = 0;
				// console.log(x);

				// await time(x);

				// console.log("done");
				// console.log(x);

				// 		const generations = await dalle.generate(
				// 			"aerial view of " +
				// 				query +
				// 				" forest " +
				// 				yearArr[choice] +
				// 				" years into the future with " +
				// 				"50" +
				// 				"% less foliage due to deforestation"
				// 		);

				// 		console.log(generations);
			} else {
				setQuery("");
			}
		})();
	};

	const filter = async (e) => {
		const word = e.target.value.replace(/[^a-z ]/gi, "");

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
			{!about && (
				<>
					{(!generated && !loading) && (
						<div className="w-full relative css-center h-12 z-10">
							<div className="absolute top-0 h-center w-1/2 flex space-x-3">
								<div
									className="w-full backdrop-blur-2xl rounded-3xl flex flex-wrap box-content hover:bg-white hover:bg-opacity-5 duration-150 ease-in-out"
									style={{
										border: "rgba(255,255,255,0.75) solid 0.5px",
										height: years ? "48px" : "auto",
									}}
								>
									<div className="flex w-full">
										<MagnifyingGlassIcon className="w-6 h-6 mt-auto mb-auto ml-4 placeholder-white::placeholder opacity-75 pointer-events-none" />

										{query !== "" && (
											<Cross2Icon
												onMouseDown={() => {
													setQuery("");
												}}
												className="cursor-pointer absolute right-4 w-5 h-5 top-3.5 placeholder-white::placeholder opacity-75 hover:opacity-100"
											/>
										)}

										<input
											className="text-lg w-full pb-[2px] pl-2 placeholder:white h-12"
											type="search"
											value={query}
											onChange={(e) => {
												setSearch(true);
												filter(e);
											}}
											onBlur={() => {
												setSearch(false);
											}}
											onKeyUp={(e) => {
												if (e.key === "Enter") {
													call(e.target.value);
												} else {
													e.target;
												}
											}}
											placeholder="Search a country — look into the future"
										/>
									</div>

									{search && (
										<div className="w-full">
											{results && results.length > 0 && (
												<>
													<div className="ml-4 mr-4 h-[0.5px] w-auto bg-white opacity-75"></div>

													<div
														className="overflow-y-scroll pt-2 pb-2"
														style={{ maxHeight: "176px" }}
													>
														{results.map((country, i) => (
															<div
																className="cursor-pointer h-10 leading-10 ml-2 mr-2 pl-2 pr-2 hover:bg-black hover:bg-opacity-10 rounded-xl text-lg"
																key={i}
																onMouseDown={() => {
																	setQuery(country);
																	call(country);
																}}
															>
																{country}
															</div>
														))}
													</div>
												</>
											)}
										</div>
									)}
								</div>

								<div
									ref={yearsRef}
									onClick={() => {
										if (years) {
											console.log("hide");
											setYears(false);
										} else {
											console.log("show");
											setYears(true);
										}
									}}
									className="box-content cursor-pointer backdrop-blur-2xl rounded-3xl flex flex-wrap flex-1 hover:bg-white hover:bg-opacity-5 duration-150 ease-in-out"
									style={{
										zIndex: "9999",
										border: "rgba(255,255,255,0.75) solid 0.5px",
										height: years ? "auto" : "48px",
									}}
								>
									<div
										className="flex w-[160px] justify-between"
										// onMouseDown={() => {
										// 	console.log("click");
										// 	// setYears(!years);
										// }}
									>
										<p className="ml-4 leading-[3rem] text-lg noselect text-left">
											in {yearArr[choice]} years
										</p>

										{/* &nbsp;
									</p>
									<p className="leading-[3rem] text-lg w-3 text-center noselect">
										{yearArr[choice].slice(0, 1)}
									</p>
									<p className="leading-[3rem] text-lg w-3 text-center noselect">
										{yearArr[choice].slice(1)}
									</p>
									<p className="leading-[3rem] text-lg noselect">&nbsp; */}

										{/* years</p> */}
										<ChevronDownIcon
											className="ml-1 mr-3 w-5 h-5 mt-[.875rem] placeholder-white::placeholder opacity-75"
											style={{
												transform: years ? "rotate(180deg)" : "rotate(0)",
											}}
										/>
									</div>

									{/* <div
							ref={yearsRef}
							style={{
								zIndex: "9999",
								width: "100%",
							}}
						> */}
									{years && (
										<div className="w-full">
											{yearArr && yearArr.length > 0 && (
												<>
													<div className="ml-4 mr-4 h-[0.5px] w-auto bg-white opacity-75"></div>

													<div
														className="overflow-y-scroll pt-2 pb-2 w-full"
														style={{ maxHeight: "176px" }}
													>
														{yearArr.map((country, i) => (
															<div
																className="cursor-pointer h-10 leading-10 ml-2 mr-2 pl-2 pr-2 hover:bg-black hover:bg-opacity-10 rounded-xl text-lg text-opacity-100 text-white"
																key={i}
																onMouseDown={() => {
																	setChoice(i);
																	setYears(false);
																}}
															>
																<p className="inline-block noselect">
																	in {country} years
																	{/* &nbsp;</p>

															<p className="noselect inline-block w-3 text-center text-white text-opacity-100">
																{country.slice(0, 1)}
															</p>
															<p className="noselect inline-block w-3 text-center text-white text-opacity-100">
																{country.slice(1)}
															</p>
															<p className="noselect inline-block">
																&nbsp; */}
																	{/* years */}
																</p>
															</div>
														))}
													</div>
												</>
											)}
										</div>
									)}
								</div>
								{/* </div> */}
							</div>
						</div>
					)}

					<div className="fixed top-0 w-full h-1/3 bg-gradient-to-b to-transparent from-black-40 pointer-events-none"></div>

					<div className="fixed bottom-0 w-full h-1/3 bg-gradient-to-t to-transparent from-black-40 pointer-events-none"></div>

					<h1 className="fixed top-7 left-7 font-semibold text-2xl">
						Terrestrial
					</h1>

					<h3 className="fixed bottom-7 left-7 font-semibold text-lg whitespace-pre-wrap leading-snug">
						{bgInfo}
					</h3>

					<div
						onClick={() => {
							setAbout(true);
						}}
						className="hover leading-8 fixed top-7 right-7 text-m cursor-pointer font-semibold"
					>
						About
					</div>
				</>
			)}

			{loading && (
				<div className="loading-icon full-circle w-20 -ml-10 -mt-10 h-20 border-[6px] css-center"></div>
			)}

			{generated && (
				// <div className="">
				<img
					src={bg}
					className="css-center h-2/3 aspect-square object-cover "
				></img>
				// </div>
			)}

			{about && (
				<>
					<div className="w-full h-full fixed backdrop-blur-xl"></div>
					<div className="w-full h-full overflow-y-scroll z-10">
						<div className="about ml-auto mr-auto box-border pl-3 pr-3 max-w-screen-md pt-[120px] pb-[120px] space-y-12 ">
							<div>
								<h1>
									What if AI could show us the future of our terrestrial
									ecosystems?
								</h1>
								<h2>
									Data visualization of our forests, years into the future
								</h2>
								<p className="text-xl">
									Terrestrial uses stable diffusion to generate AI images that
									give you a peek into the effects of deforestation, years into
									our planet’s future.
								</p>
							</div>
							<div>
								<h2>AI-generated images</h2>
								<p className="text-xl">
									Uniform query optimized prompts are fed to a stable diffusion
									model — producing an entirely unique AI generated image that
									changes based on time and location.
								</p>
							</div>
							<div>
								<h2>10 million hectares of forest are destroyed every year</h2>
								<p className="text-xl">
									Human life depends on the earth for our sustenance and
									livelihoods. Plant life provides 80 percent of the human diet,
									and we rely on agriculture as an important economic resource.
									Forests cover 30 percent of the Earth’s surface, providing
									vital habitats for millions of species, and important sources
									for clean air and water. - UN SDG
								</p>
							</div>
							<div>
								<h2>
									Promoting the protection and restoration of terrestrial
									ecosystems
								</h2>
								<p className="text-xl">
									This application is useful to biodiversity researchers,
									statisticians, policy-makers, activists, and the general
									public who are looking to proactively: gain insight, and
									promote the protection and restoration of terrestrial
									ecosystems.
								</p>
							</div>
						</div>
					</div>

					<Cross2Icon
						style={{
							zIndex: "9999",
						}}
						onMouseDown={() => {
							setAbout(false);
						}}
						className="cursor-pointer absolute right-7 w-8 h-8 top-7 placeholder-white::placeholder opacity-75 hover:opacity-100 ease-in-out duration-150"
					/>
				</>
			)}
		</div>
	);
}

export default App;
