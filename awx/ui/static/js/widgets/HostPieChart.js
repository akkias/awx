/*********************************************
 *  Copyright (c) 2014 AnsibleWorks, Inc.
 *
 * HostPieChart.js
 *
 * file for the host status pie chart
 *
 */

'use strict';

angular.module('HostPieChartWidget', ['RestServices', 'Utilities'])
    .factory('HostPieChart', ['$rootScope', '$compile', '$location' , 'Rest', 'GetBasePath', 'ProcessErrors', 'Wait',
        function ($rootScope, $compile , $location, Rest, GetBasePath, ProcessErrors) {
            return function (params) {

                var scope = params.scope,
                    target = params.target,
                    dashboard = params.dashboard,
                    html, element, url;

                html = "<div class=\"graph-container\">\n";

                html +="<div class=\"row\">\n";
                html += "<div id=\"job-status-title\" class=\"h6 col-xs-8 text-center\"><b>Host Status</b></div>\n";
                html += "</div>\n";
                // html += "<div class=\"h6 col-xs-2 \">\n";
                // html += "<div class=\"dropdown\">\n";
                // html += "<a id=\"dLabel\" role=\"button\" data-toggle=\"dropdown\" data-target=\"#\" href=\"/page.html\">\n";
                // html += "Filter<span class=\"caret\"></span>\n";
                // html += "  </a>\n";

                // html += "<ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dLabel\">\n";
                // html += "<li><a class=\"j\" id=\"all\">Source</a></li>\n";
                // html += "<li><a class=\"j\" id=\"inv_sync\">Inventory</a></li>\n";
                // html += "</ul>\n";
                // html += "</div>\n";

                // html += "</div>\n"; //end of filter div



                html +="<div class=\"row\">\n";
                html += "<div class=\"host-pie-chart\"><svg></svg></div>\n";
                html += "</div>\n";

                html += "</div>\n";

                function exampleData() {
                    return [
                        {
                            "label": "Successful",
                            "value" : dashboard.hosts.total
                        } ,
                        {
                            "label": "Failed",
                            "value" : dashboard.hosts.failed
                        }
                    ];

                }




                element = angular.element(document.getElementById(target));
                element.html(html);
                $compile(element)(scope);

                url = GetBasePath('dashboard')+'graphs/inventory/';
                Rest.setUrl(url);
                Rest.get()
                        .success(function (data){
                            scope.$emit('createHostPieChart', data.inventory);


                        })
                        .error(function (data, status) {
                            ProcessErrors(scope, data, status, null, { hdr: 'Error!',
                                msg: 'Failed to get: ' + url + ' GET returned: ' + status });
                        });

                if (scope.removeCreateHostPieChart) {
                    scope.removeCreateHostPieChart();
                }
                scope.removeCreateHostPieChart = scope.$on('createHostPieChart', function (e, data) {
                    data = exampleData();
                    nv.addGraph(function() {
                        var width = nv.utils.windowSize().width/3,
                        height = nv.utils.windowSize().height/5,
                        chart = nv.models.pieChart()
                          .x(function(d) { return d.label; })
                          .y(function(d) { return d.value; })
                          .showLabels(true);

                        d3.select(".host-pie-chart svg")
                            .datum(data)
                            .attr('width', width)
                            .attr('height', height)
                            .transition().duration(350)
                            .call(chart);
                        nv.utils.windowResize(chart.update);
                        return chart;
                    });
                });
            };
        }
    ]);
