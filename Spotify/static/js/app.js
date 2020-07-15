// Call Dates Route
d3.json(`/dates`).then(data => {

    // Select & Save Dropdown 
    var dropdown = d3.select("#selDate")

    // For Each Date
    data.forEach(entry => {

        // Append Date Into Dropdown
        dropdown.append('option').attr('value', entry).text(entry).property('value')
    })

    // Create Load Page Function
    function loadPage(date) {

        // Song Informaton
        // Call Data Route
        d3.json(`/data/${date}`).then(data => {

            // Select & Save Song Information ID
            var sampleData = d3.select(`#song-information`)

            // Clear HTML
            sampleData.html("")

            // Update HTML
            sampleData.html(`\
            <p style="color: white !important">Position: ${data.position}</p>\
            <p style="color: white !important">Artist: ${data.artist}</p>\
            <p style="color: white !important">Song: ${data.track_name}</p>\
            <p style="color: white !important">Number of Streams: ${data.streams}</p>\
            `)
        })

        // Bar Chart
        // Call Data Route
        d3.json(`/data/${date}`).then(data => {

            // Select & Save Track Name
            var song = data.track_name

            // Call Bar Route
            d3.json(`/bar/${song}/${date}`).then(data => {

                // Empty Array to Hold Regions
                var bar_regions = []

                // For Loop to Push Regions to Array
                for (var i = 0; i < data.length; i++) {
                    bar_regions.push(data[i][1])
                }

                // Empty Array to Hold Streams
                var bar_streams = []

                // For Loop to Push Streams to Array
                for (var i = 0; i < data.length; i++) {
                    bar_streams.push(data[i][0])
                }

                // Create Bar Data
                var barData = [{
                    x: bar_streams,
                    y: bar_regions,
                    text: bar_regions,
                    marker: {
                        color: 'rgb(30, 215, 96)'
                    },
                    type: 'bar',
                    orientation: 'h'
                }]

                // Create Bar Layout
                var barLayout = {
                    font: { color: 'white' },
                    yaxis: {
                        autorange: true,
                        type: 'category',
                        title: {
                            text: 'Country Code',
                            font: { color: 'white' }
                        }
                    },
                    xaxis: {
                        title: {
                            text: 'Number of Streams',
                            font: { color: 'white' }
                        }
                    },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    margin: {
                        l: 100,
                        r: 100,
                        t: 0,
                        b: 50
                    }

                }

                // Plot Bar Chart 
                Plotly.newPlot("bar", barData, barLayout, responsive = true)
            })
        })

        // Gauge Chart
        // Call Data Route
        d3.json(`/data/${date}`).then(data => {

            // Select & Save Track Name
            var song = data.track_name

            // Call Gauge Route
            d3.json(`/gauge/${song}`).then(data => {

                // Find & Save Length of Data
                var top_length = data.length

                // Create Gauge Data
                var gaugeData = [{
                    value: parseFloat(top_length),
                    rotation: 90,
                    type: "indicator",
                    mode: "gauge+number",
                    gauge: {
                        axis: { range: [null, 90] },
                        bar: { color: "white" },
                        steps: [
                            { range: [0, 10], color: "rgba(0, 215, 96, .60)" },
                            { range: [10, 20], color: 'rgba(0, 215, 96, .65)' },
                            { range: [20, 30], color: 'rgba(0, 215, 96, .70)' },
                            { range: [30, 40], color: 'rgba(0, 215, 96, .75)' },
                            { range: [40, 50], color: 'rgba(0, 215, 96, .80)' },
                            { range: [50, 60], color: 'rgba(0, 215, 96, .85)' },
                            { range: [60, 70], color: 'rgba(0, 215, 96, .9)' },
                            { range: [70, 80], color: 'rgba(0, 215, 96, .95)' },
                            { range: [80, 90], color: 'rgba(0, 215, 96, 1)' }
                        ]
                    }
                }]

                // Create Gauge Chart Layout
                var gaugeLayout = {
                    width: 500,
                    height: 400,
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    font: { color: 'white' }
                }
                // Plot Gauge Chart
                Plotly.newPlot('gauge', gaugeData, gaugeLayout, responsive = true)
            })
        })

        // Line Graph
        // Call Data Route
        d3.json(`/data/${date}`).then(data => {

            // Select & Save Track Name
            var song = data.track_name

            // Call Line Route
            d3.json(`/line/${song}`).then(data => {

                // Empty Array to Hold Dates
                var line_dates = []

                // For Loop to Push Dates to Array
                for (var i = 0; i < data.length; i++) {
                    line_dates.push(data[i][1])
                }

                // Empty Array to Hold Streams
                var line_streams = []

                // For Loop to Push Streams to Array
                for (var i = 0; i < data.length; i++) {
                    line_streams.push(data[i][4])
                }

                // Create Trace
                var trace = {
                    x: line_dates,
                    y: line_streams,
                    type: "scatter",
                    line: {
                        color: 'rgb(30, 215, 96)',
                        width: 3
                    }
                }

                var lineLayout = {
                    font: { color: 'white' },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    yaxis: {
                        title: {
                            text: 'Streams',
                            font: { color: 'white' }
                        }
                    },
                    xaxis: {
                        title: {
                            text: 'Date',
                            font: { color: 'white' }
                        }
                    },
                }

                // Save Trace in Array
                var data = [trace];
                Plotly.newPlot("line", data, lineLayout);
            })
        })
    }

    // Create Init Function
    function init() {

        // Select & Save Date from Dropdown
        var date = dropdown.property('value')

        // Deploy Load Page Function
        loadPage(date)

        // On Change
        d3.selectAll("#selDate").on("change", function () {

            // Select & Save Date from Dropdown
            var date = dropdown.property('value')

            // Deploy Load Page Function
            loadPage(date)
        })
    }

    // Deploy Init Function
    init()
    // jQuery CSS
    $(document).ready(function () {
        $('#spotify-jumbotron').css("background-color", "black")
        $('#spotify-well').css("background-color", "black")
        $('#spotify-panel-default').css("background-color", "black")
        $('body').attr('style', 'background-color: black !important')
        $('h1').attr('style', 'color: white !important')
        $('h3').attr('style', 'color: white !important')
        $('h5').attr('style', 'color: white !important')
        $('.color').attr('style', 'color: rgb(30, 215, 96) !important')
        $('.center').attr('style', 'text-align: center !important')
        $('.panel-title').attr('style', 'color: white !important')
        $('.panel-heading').attr('style', 'background-color: rgb(30, 215, 96) !important')
    })
})