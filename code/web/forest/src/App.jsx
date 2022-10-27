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

import bg from "./assets/images/test.jpg";

function App() {
	const [query, setQuery] = useState("");
	const [choice, setChoice] = useState(3);
	const yearArr = ["05", "10", "15", "20"];
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
			<div className="w-full relative css-center h-12">
				<div className="absolute top-0 h-center w-1/2 flex space-x-3">
					<div
						className="w-full backdrop-blur-2xl rounded-3xl flex flex-wrap box-content"
						style={{
							border: "rgba(255,255,255,0.75) solid 0.5px",
							height: years ? "48px" : "auto",
						}}
					>
						<div className="flex w-full">
							<MagnifyingGlassIcon className="w-6 h-6 mt-auto mb-auto ml-4 placeholder-white::placeholder opacity-75 pointer-events-none" />

							{/* {query === "" && (
					<p className="pl-11 absolute leading-[3rem] mt-[-2px] opacity-60 pointer-events-none text-lg">
						Search a country — look into the future
					</p>
				)} */}

							{query !== "" && (
								<Cross2Icon
									onMouseDown={() => {
										setQuery("");
									}}
									className="cursor-pointer absolute right-4 w-5 h-5 top-3.5 placeholder-white::placeholder opacity-75"
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
						style={{
							zIndex: "9999",
							// width: "100%",
						}}
						onClick={() => {
							if (years) {
								console.log("hide");
								setYears(false);
							} else {
								console.log("show");
								setYears(true);
							}
						}}
						className="box-content cursor-pointer backdrop-blur-2xl rounded-3xl flex flex-wrap flex-1"
						style={{
							border: "rgba(255,255,255,0.75) solid 0.5px",
							// height: years ? "176px" : "48px",
						}}
					>
						<div
							className="flex w-full"
							// onMouseDown={() => {
							// 	console.log("click");
							// 	// setYears(!years);
							// }}
						>
							<p className="leading-[3rem] text-lg ml-4 noselect">in&nbsp;</p>
							<p className="leading-[3rem] text-lg w-3 text-center noselect">
								{yearArr[choice].slice(0, 1)}
							</p>
							<p className="leading-[3rem] text-lg w-3 text-center noselect">
								{yearArr[choice].slice(1)}
							</p>
							<p className="leading-[3rem] text-lg noselect">&nbsp;years</p>
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
													<p className="inline-block noselect">in&nbsp;</p>

													<p className="noselect inline-block w-3 text-center text-white text-opacity-100">
														{country.slice(0, 1)}
													</p>
													<p className="noselect inline-block w-3 text-center text-white text-opacity-100">
														{country.slice(1)}
													</p>
													<p className="noselect inline-block">&nbsp;years</p>
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

			<div className="fixed top-0 w-full h-1/3 bg-gradient-to-b to-transparent from-black-40 pointer-events-none"></div>

			<div className="fixed bottom-0 w-full h-1/3 bg-gradient-to-t to-transparent from-black-40 pointer-events-none"></div>

			<h1 className="fixed top-7 left-7 font-semibold text-2xl">Terrestrial</h1>

			<h3 className="fixed bottom-7 left-7 font-semibold text-lg whitespace-pre-wrap leading-snug">
				{bgInfo}
			</h3>

			<Link
				to="/about"
				className="leading-8 fixed top-7 right-7 text-m cursor-pointer font-semibold"
			>
				About
			</Link>
		</div>
	);
}

export default App;
