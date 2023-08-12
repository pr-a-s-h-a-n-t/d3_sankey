import { useState } from 'react';
import { scaleOrdinal } from "d3";
import { sankey, sankeyJustify, sankeyLinkHorizontal } from "d3-sankey";
import './index.css';
// import icons from react-icons
import { BsWhatsapp } from 'react-icons/bs';
import { BsFillChatLeftDotsFill } from 'react-icons/bs';
import { AiFillMessage } from 'react-icons/ai';
import { TbBrandGmail } from 'react-icons/tb';

import  whatsapp  from '../assets/whatsapp.svg';

const MARGIN_Y = 25;
const MARGIN_X = 5;
 

const ChartComponent = ({ width, height, data }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);

    console.log("data I am getting to console--->", data)
    const allGroups = [...new Set(data.nodes.map((d) => d.category))].sort();
 

    const sankeyGenerator = sankey()
        .nodeWidth(35)
        .nodePadding(40)
        
        .extent([
            [MARGIN_X, MARGIN_Y],
            [width - MARGIN_X, height - MARGIN_Y]
        ])
        .nodeId((node) => node.name)
        .nodeAlign(sankeyJustify);

    const { nodes, links } = sankeyGenerator(data);

    const handleMouseEnter = (node) => {
        setModalData({
            name: node.name,
            category: node.category,
            x: node.x1,  // or node.x0 based on preference
            y: (node.y1 + node.y0) / 2,
            leak: node.leaks || 0
        });
        setModalVisible(true);
    }

    const handleMouseLeave = () => {
        setModalVisible(false);
    }

    // const allNodes = nodes.map((node) => (
    //     <g key={node.index}
    //         onMouseEnter={() => handleMouseEnter(node)}
    //         onMouseLeave={handleMouseLeave}
    //     >
    //         <rect
    //             height={node.y1 - node.y0}
    //             width={sankeyGenerator.nodeWidth()}
    //             x={node.x0}
    //             y={node.y0}
    //             stroke={"black"}
    //             fill={colorScale(node.category)}
    //             fillOpacity={1}
    //             rx={0.9}
    //         />
    //     </g>
    // ));

    const funnelStyle = {
        fill: 'red',
        stroke: 'black',
        strokeWidth: 1,
        opacity: 1,

    };
    const allNodes = nodes.map((node) => (


        <g key={node.index}
            onMouseEnter={() => handleMouseEnter(node)}
            onMouseLeave={handleMouseLeave}
        >
            <rect
                height={node.y1 - node.y0}
                width={sankeyGenerator.nodeWidth()}
                x={node.x0}
                y={node.y0}
                stroke={"black"}
                // fill={node.leaks ? 'red' : colorScale(node.category)}
                fill={'#95C4F7'}
                fillOpacity={1}
                rx={0.9}
                
            />
            {node.leaks &&
            
                <polygon
                    points={`${node.x0 - 20},
                    ${node.y0 + 50}
                     ${node.x0 + 20},
                     ${node.y0 + 50}
                      ${node.x0 + 15},
                      ${node.y0 + 70} 
                      ${node.x0 - 15},
                      ${node.y0 + 70}`}
                    style={funnelStyle}
                />
                
            }
        </g>
    ));


    const allLinks = links.map((link, i) => {
        const linkGenerator = sankeyLinkHorizontal();
        const path = linkGenerator(link);

        return (
            <path
                key={i}
                d={path}
                // stroke={colorScale(link.source.category)}
                stroke={'#E3EFFF'}
            
                fill="none"
                strokeOpacity={1}
                strokeWidth={link.width}
            />
        );
    });
    // below function is showing the leaks,
    const allLabels = nodes.map((node, i) => (
        <text
            key={i}
            x={node.x0 < width / 2 ? node.x1 + 6 : node.x0 - 6}
            y={(node.y1 + node.y0) / 2}
            dy="0.35rem"
            textAnchor={node.x0 < width / 2 ? "start" : "end"}
            fontSize={12}
        >
            {node.name} ({node.leaks || 0} leaks)
        </text>
    ));

    const uniqueXPositions = [...new Set(nodes.map((node) => node.x0))].sort((a, b) => a - b);
    const columnNames = ["First", "Second", "Third", "Fourth"];

    const columnLabels = uniqueXPositions.map((xPos, i) => (
        <text
            key={i}
            x={xPos + 20}
            y={MARGIN_Y - 10}
            textAnchor="middle"
            fontSize={14}
        >
            {`Stage ${i}`}
        </text>
    ));

   




    const Modal = ({ node }) => {
        if (!node) return null;

        // Adjust these values if you want more or less offset
        const offsetX = 10;
        const offsetY = -20;

        const modal_data = [
            {
                stageId: 4,
                stageName: "Targeted Schools - Read First Msg",
                inCount: 9622,
                inPercentage: 99.98,
                outCount: 420,
                outPercentage: 4.36,
                sittingCount: 0,
                sittingPercentage: 0,
                leakCount: 9202,
                leakPercentage: 95.62,
                averageTime: "7 hours 0 minutes",
                colorPalette: {
                    focusedVersion: "#3582CF",
                    secondaryVersion: "#BFDFFF",
                },
                sourcePercentage: [
                    {
                        sourceName: "Custom Chat-bot",
                        percentage: "0.05%",
                    },
                    {
                        sourceName: "WhatsApp_360_Dialogue",
                        percentage: "99.95%",
                    },
                    {
                        sourceName: "WhatsApp",
                        percentage: "48.95%",
                    },
                ],
            },
            // ... If there are more objects in the array, you can add them here.
        ];
    

        return (
            <div
                className="modalWrapper"
                style={{
                    position: 'absolute',
                    left: `${node.x + offsetX + 45}px`,
                    top: `${node.y + offsetY}px`,
                    borderRadius: '5px',

                    // width: '200px',
                    height: 'auto',
                    background: '#fff',
                    border: '1px solid #ccc',
                    padding: '10px',
                    zIndex: 10,
                }}>
                <div
                    style={{
                        // position: 'absolute',
                        // top: position.y + 28,
                        // left: '60%',

                    }}>
                    <h3 className="stageName">{modal_data?.stageName || "Targeted Schools - Read First Msg"}</h3>
                    <div
                        style={{
                            backgroundColor: `${modal_data?.colorPalette?.secondaryVersion}`,
                        }}
                        className="inner">
                        <div className="list">
                            <span>In Leads</span>
                            <span className="list_data">{120}</span>
                        </div>
                        <div className="list">
                            <span>Out Leads</span>
                            <span className="list_data">{120}</span>
                        </div>
                        <div className="list">
                            <span>Setting Leads</span>
                            <span className="list_data">{120}</span>
                        </div>
                        <div
                            style={{
                                borderBottom: 'none',
                                paddingBottom: '0px',
                            }}
                            className="list">
                            <span>Leak Leads</span>
                            <span className="list_data">{120}</span>
                        </div>
                    </div>
                    <div className="iconswrapper">
                        {/* <h3 className="stageName">{data?.stageName ||  "Targeted Schools - Read First Msg"}</h3> */}
                        {['Whatsapp', 'Gmail','Custom Chat-bot', 'SMS' ]?.map((item, index) => {
                            let iconSrc = null;

                            if (item?.sourceName === 'Whatsapp') {
                                iconSrc = <BsWhatsapp />;
                            } else if (item?.sourceName === 'Gmail') {
                                iconSrc = <TbBrandGmail/>;
                            } else if (item?.sourceName === 'Custom Chat-bot') {
                                iconSrc = <AiFillMessage />;
                            }
                            else if (item?.sourceName === 'SMS') {
                                iconSrc = <BsFillChatLeftDotsFill />;
                            }

                            return (
                                <div className="icons" key={index}>
                                     <img src={whatsapp} alt={item?.sourceName} />
                                    <span>{item?.percentage || 0.000}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }




    return (
        <div style={{
            margin: 'auto !important',
            width: '100%',
            height: '100%',
        }}>
            {isModalVisible && <Modal node={modalData} />}
            <svg
            
            style={{
                margin: 'auto !important',
            }}
            width={width} height={height}>
                {allLinks}
                {allNodes}
                {allLabels}
                {columnLabels}
            </svg>
        </div>
    );
};

export default ChartComponent;
