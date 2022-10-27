import React, { useState, useEffect } from "react";
import useComponentVisible from "./utils/useComponentVisible";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import countries from "./data/countries.json";
import forests from "./data/annual-change-forest-area.json";

import bg from "./assets/images/test.jpg";

function App() {
	const [query, setQuery] = useState("");
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
				<div
					className="absolute h-center w-1/2 backdrop-blur-2xl rounded-3xl flex flex-wrap"
					style={{
						border: "rgba(255,255,255,0.75) solid 0.5px",
            
					}}
				>
					<div className="flex w-full">
						<MagnifyingGlassIcon className="w-6 h-6 mt-auto mb-auto ml-4 placeholder-white::placeholder opacity-75 pointer-events-none" />

						{/* {query === "" && (
					<p className="pl-11 absolute leading-[3rem] mt-[-2px] opacity-60 pointer-events-none text-lg">
						Search a country — look into the future
					</p>
				)} */}

						<input
							className="text-lg w-full pb-[2px] pl-2 placeholder:white h-12"
							type="text"
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

                  <div className="overflow-y-scroll pt-2 pb-2" style={{maxHeight: "168px"}}>
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

					<div
						ref={yearsRef}
						style={{
							zIndex: "9999",
						}}
					>
						{years && (
							<div>
								<div></div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
