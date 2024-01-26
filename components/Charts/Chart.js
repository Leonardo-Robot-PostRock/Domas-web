import React from 'react';
import { Chart as ChartJS, LinearScale, CategoryScale, ArcElement, BarElement, PointElement, LineElement, Legend, Tooltip, LineController, BarController, PieController } from 'chart.js';
import { getRelativePosition, distanceBetweenPoints } from 'chart.js/helpers';
import { Chart } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Box } from '@chakra-ui/react';
import { useContext } from 'react';


ChartJS.register(
    LinearScale,
    CategoryScale,
    ArcElement,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
    PieController,
    ChartDataLabels,
);

const ChartComponent = ({data, suggestedMax, stacked = false, type = 'bar', onClick, context = null, interactionMode = 'index', intersect = false, formatter = null, scales, radius, sort = null}) => {  

    const contextRef = context? useContext(context) : null;

    const options = {        
        interaction: {
            mode: interactionMode,
            intersect: intersect,
        },
        layout: {
            padding: {
                top: 30,
            }  
        },
        plugins: {
            datalabels: {
                backgroundColor: function(context) {
                    return context.dataset.backgroundColor;
                },
                borderRadius: 4,
                color: 'white',
                font: {
                    weight: 'bold',
                    size: 15,
                },
                formatter: formatter? formatter : Math.round,
                padding: 3,
                //clamp: true,
                anchor: 'end',
                display: (context) => {
                    let index = context.dataIndex;
                    let value = context.dataset.data[index];
                    if(value === null){
                        return false;
                    }
                    return true;
                }
            },
            legend: {
                align: 'center',
                position: 'bottom',
                labels: {
                    boxWidth: 20
                }
            },
            tooltip: {
                bodyFont: {
                    size: 15,
                },
                boxPadding: 4,   
                filter: (tooltipItem, data) => {
                    if(tooltipItem.formattedValue === '0') {
                        return false;
                    } else {
                        return true;
                    }
                },
                itemSort: sort             
            }
        }        
    }

    if(scales) {
        options.scales = {
            x: {
                stacked: stacked,
            },
            y: {
                suggestedMax: suggestedMax,
                stacked: stacked,
            }
        }
    }

    if(radius) {
        options.radius = radius;
    }

    return (
        <Chart 
            ref={contextRef}
            options={options} 
            type={type} 
            data={data} 
            plugins={[ChartDataLabels]} 
            onClick={onClick}
        />
    )

}

export const CustomPieChart = ({data, onClick, context, formatter = null}) => {
    
    const contextRef = context? useContext(context) : null;
   
    const options = {
        responsive: true,
        radius: '90%',
        animation:{
            duration: 500,
            animateRotate: true,
            animateScale: true
        },
        interaction: {
            mode: 'index',
            intersect: true,
        },
        plugins: {
            datalabels: {
                backgroundColor: function(context) {
                    return context.dataset.backgroundColor;
                },
                borderRadius: 4,
                color: 'white',
                font: {
                    weight: 'bold',
                    size: 15,
                },
                formatter: formatter? formatter : Math.round,
                padding: 3,
                clamp: true,
                anchor: 'end',
            },
            legend: {
                align: 'center',
                position: 'bottom',
                labels: {
                    boxWidth: 20
                }
            },
            tooltip: {
                bodyFont: {
                    size: 15,
                },
                boxPadding: 4,
            }
        },
        onClick: function(event, elements) {   
            if(elements.length === 0) {
                return;
            } 
                        
            if (contextRef.croppedElement?.index === elements[0].index) {
                let properties = {
                    outerRadius: contextRef.croppedElement.element.outerRadius -= 10
                }

                contextRef.current._metasets[0].controller.updateElement(contextRef.croppedElement.element, contextRef.croppedElement.index, properties, 'active');
                contextRef.croppedElement = null;
                return; 
            }

            let elementProps = elements[0].element;

            const angle = elementProps.startAngle + elementProps.circumference/2;

            let properties = {
                x: elementProps.x += 10 * Math.cos(angle),
                y: elementProps.y += 10 * Math.sin(angle),
                outerRadius: elementProps.outerRadius += 10,
            }

            contextRef.current._metasets[0].controller.updateElement(elements[0].element, elements[0].index, properties, 'active');
            contextRef.croppedElement = elements[0];
        }
    }

    return (
        <Chart
            ref={contextRef}
            options={options}
            type={'pie'}
            data={data}
            plugins={[ChartDataLabels]}
            onClick={onClick}
        />
    )
}

export default ChartComponent;