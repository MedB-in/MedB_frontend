import React from "react";

export const Reports = () => {
    return (
        <div className="bg-white border p-6 rounded-lg border-solid my-5 shadow-lg border-[rgba(0,0,0,0.1)]">
            <h2 className="text-[19px] font-bold mb-5">Reports</h2>

            <div className="p-6 rounded-[14px] grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Round Chart */}
                <div className="flex justify-center">
                    <svg
                        width="346"
                        height="299"
                        viewBox="0 0 346 299"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M0.881104 13.9917C0.881104 6.25971 7.14912 -0.00830078 14.8811 -0.00830078H331.686C339.418 -0.00830078 345.686 6.25971 345.686 13.9917V284.992C345.686 292.724 339.418 298.992 331.686 298.992H14.8811C7.14912 298.992 0.881104 292.724 0.881104 284.992V13.9917Z"
                            fill="#D2ECEA"
                            fillOpacity="0.3"
                        />
                        <path
                            d="M286.116 140.176C286.116 115.601 278.583 91.6164 264.531 71.4551C250.479 51.2938 230.584 35.9247 207.528 27.4193C184.471 18.9139 159.362 17.681 135.583 23.8867C111.804 30.0924 90.4996 43.4385 74.54 62.1262C58.5805 80.8139 48.7334 103.945 46.3258 128.402C43.9182 152.859 49.0659 177.466 61.0752 198.907C73.0844 220.348 91.3778 237.592 113.49 248.315C135.602 259.039 160.47 262.726 184.742 258.879L177.406 212.585C162.6 214.931 147.431 212.682 133.942 206.141C120.454 199.6 109.295 189.081 101.969 176.002C94.6437 162.923 91.5036 147.912 92.9722 132.994C94.4408 118.075 100.448 103.965 110.183 92.5656C119.918 81.1661 132.914 73.025 147.419 69.2395C161.924 65.454 177.241 66.2061 191.305 71.3944C205.37 76.5827 217.506 85.9578 226.077 98.2563C234.649 110.555 239.244 125.185 239.244 140.176H286.116Z"
                            fill="#19A18A"
                        />
                        <path
                            d="M286.116 140.176C286.116 112.591 276.627 85.8454 259.241 64.4288C241.856 43.0121 217.632 28.228 190.636 22.558C163.639 16.8879 135.515 20.6771 110.982 33.2895C86.4486 45.9019 67.0011 66.5698 55.9031 91.824L98.8144 110.681C105.584 95.2762 117.447 82.6688 132.412 74.9753C147.377 67.2817 164.534 64.9703 181.001 68.429C197.469 71.8877 212.245 80.906 222.851 93.9702C233.456 107.034 239.244 123.349 239.244 140.176H286.116Z"
                            fill="#122421"
                        />
                        <path
                            d="M286.116 140.176C286.116 118.714 280.369 97.643 269.472 79.1531C258.574 60.6631 242.924 45.4287 224.148 35.0325C205.372 24.6364 184.154 19.4579 162.7 20.0352C141.245 20.6124 120.337 26.9243 102.146 38.315L127.023 78.0408C138.119 71.0925 150.873 67.2422 163.96 66.8901C177.048 66.538 189.99 69.6969 201.444 76.0385C212.897 82.3801 222.444 91.6732 229.091 102.952C235.739 114.231 239.244 127.084 239.244 140.176H286.116Z"
                            fill="#548079"
                        />
                        <path
                            d="M286.116 140.176C286.116 168.888 275.837 196.651 257.14 218.441C238.443 240.23 212.563 254.606 184.184 258.966L177.066 212.638C194.377 209.978 210.164 201.209 221.569 187.917C232.974 174.626 239.244 157.69 239.244 140.176H286.116Z"
                            fill="#86CFC3"
                        />
                        <path
                            d="M286.116 140.176C286.116 125.225 283.326 110.404 277.89 96.4761L234.226 113.519C237.543 122.015 239.244 131.056 239.244 140.176H286.116Z"
                            fill="#6F64E7"
                        />
                        <text
                            fill="black"
                            xmlSpace="preserve"
                            style={{ whiteSpace: "pre" }}
                            fontFamily="Inter"
                            fontSize="20"
                            fontWeight="600"
                            letterSpacing="0.01em"
                        >
                            <tspan x="138.909" y="124.172">
                                Total{" "}
                            </tspan>
                            <tspan x="118.357" y="148.172">
                                Expenses
                            </tspan>
                        </text>
                        <text
                            fill="black"
                            xmlSpace="preserve"
                            style={{ whiteSpace: "pre" }}
                            fontFamily="Inter"
                            fontSize="20"
                            fontWeight="600"
                            letterSpacing="0.01em"
                        >
                            <tspan x="132.192" y="176.372">
                                40000
                            </tspan>
                        </text>
                        <text
                            fill="black"
                            xmlSpace="preserve"
                            style={{ whiteSpace: "pre" }}
                            fontFamily="Inter"
                            fontSize="10"
                            letterSpacing="0.01em"
                        >
                            <tspan x="284.754" y="286.443">
                                View More
                            </tspan>
                        </text>
                    </svg>
                </div>
                <div className="relative bg-[rgba(210,236,234,0.3)] p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-5">
                        {["140-", "120-", "100-", "80-", "60-", "40-", "20-"].map((label, index) => (
                            <div key={index} className="text-[10px] text-[rgba(0,0,0,0.7)]">
                                {label}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-end h-[200px] relative">
                        <div className="w-[25px] bg-[#6F64E7] h-[146px]" />
                        <div className="w-[25px] bg-[#86CFC3] h-[177px]" />
                        <div className="w-[25px] bg-[rgba(110,99,230,0.76)] h-[71px]" />
                        <div className="w-[25px] bg-[#D2ECEA] h-[121px]" />
                        <div className="w-[25px] bg-[#BCD6D4] h-[121px]" />
                        <div className="w-[25px] bg-[rgba(110,99,230,0.76)] h-[71px]" />
                        <div className="w-[25px] bg-[#5D52D5] h-24" />
                    </div>

                    <div className="flex justify-between text-[10px] mt-2.5">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                            <span key={index}>{day}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};