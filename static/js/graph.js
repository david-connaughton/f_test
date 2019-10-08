$(document).ready(function (){
    $("#mast").on('mouseover',function () {
        $("#mast").addClass('color');
    });
    $("#mast").on('mouseleave',function () {
        $("#mast").removeClass('color');
    });
    $("#btn-hide").on("click", function() {
        $('#wins-per-club').toggle('hidden');
    });
    $("#btn-hide").on("click", function() {
        $('.won').toggle('hidden');
    });
   
   
    $("#titles").on('mouseover',function () {
        $("#stats").removeClass('stats');
    });
    $("#titles").on('mouseleave',function () {
        $("#stats").removeClass('stats');
    });
    $('#reset-filters').click(function() {
    dc.filterAll();
    dc.renderAll();
});
    
});


queue()
    .defer(d3.csv, "data/premierLeagueData0819.csv")
    .await(makeGraphs);
    dc.config.defaultColors(d3.schemeSpectral[11]);
function makeGraphs (error, plStats) {
    var ndx = crossfilter(plStats);
   
  
    var parseDate = d3.time.format("%Y").parse;
    plStats.forEach(function (d) {
        d.total_wins=parseInt(d.total_wins);
        d.total_goals=parseInt(d.total_goals);
        d.total_spend=parseInt(d.total_spend);
        d.date =parseDate(d.date);
    });
    
    
 
   
    display_season_selector(ndx);
    display_team_selector(ndx);
    display_wins_by_club(ndx);
    display_losses_by_season(ndx);
    display_draws_by_season(ndx);
    display_points_by_season(ndx);
             losses_per_team(ndx);
    //display_wins_by_season(ndx);
    
    display_conceeded_by_season(ndx);
    display_goals_by_club(ndx);
    display_average_goals_by_season(ndx);
    display_touches_by_season(ndx);
    display_passes_by_season(ndx);
    display_spend_by_club(ndx);
 
    dc.renderAll();
    
           function display_season_selector(ndx) {
                var dim = ndx.dimension(dc.pluck('season'));
                var group = dim.group();

                dc.selectMenu(".season-selector")
                    .dimension(dim)
                    .group(group);
            }
          function display_team_selector(ndx) {
            
                var dim = ndx.dimension(dc.pluck('team'));
                var group = dim.group();

                dc.selectMenu("#team-selector")
                    .dimension(dim)
                    .group(group);
            }
            
           /* d3.selectAll("#wins-per-season").on("click", function () {
            //dc.redrawAll();
        });*/
            
 //Wins by Club
function display_wins_by_club(ndx) {
    var dim = ndx.dimension(dc.pluck('team'));
    var wins_by_club = dim.group().reduceSum(dc.pluck('total_wins'));


  
    dc.pieChart("#wins-per-club")
        .height(400)
        .radius(500)
        .dimension(dim)
        .group(wins_by_club)
        .transitionDuration(500)
        .drawPaths(false)
        .externalRadiusPadding(40)
        .minAngleForLabel(0)
        .externalLabels(20);
       
     
}        



//losses by season
   function display_losses_by_season(ndx) {
    var dim = ndx.dimension(dc.pluck('team'));
    var wins_by_club = dim.group().reduceSum(dc.pluck('total_losses'));
    
     dc.pieChart("#losses-per-season")
        .height(400)
        .radius(500)
        .dimension(dim)
        .group(wins_by_club)
        .transitionDuration(500)
        .drawPaths(false)
        .externalRadiusPadding(40)
        .minAngleForLabel(0)
        .externalLabels(20);
}

//draws by season
   function display_draws_by_season(ndx) {
    var dim = ndx.dimension(dc.pluck('team'));
    var wins_by_club = dim.group().reduceSum(dc.pluck('total_draws'));
    
     dc.pieChart("#draws-per-season")
        .height(400)
        .radius(500)
        .dimension(dim)
        .group(wins_by_club)
        .transitionDuration(500)
        .drawPaths(false)
        .externalRadiusPadding(40)
        .minAngleForLabel(0)
        .externalLabels(20);
}



//Points by season
   function display_points_by_season(ndx) {
    var dim = ndx.dimension(dc.pluck('team'));
    var points_by_club = dim.group().reduceSum(dc.pluck('total_points'));
    
    dc.rowChart("#points-per-season")
        .height(400)
        .width(700)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim)
        .group(points_by_club)
        .elasticX(true)
        .transitionDuration(500);
       
      
        
     
}


/*//wins by season

function display_wins_by_season(ndx) {
    var dim = ndx.dimension(dc.pluck('team'));
    var wins_by_season = dim.group().reduceSum(dc.pluck('total_wins'));

   
   
   
    
    dc.barChart("#wins-per-season")
        .width(650)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim)
        .group(wins_by_season)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Wins")
        .yAxis().ticks(20);
     
        
        
}*/

//goals scored by season composite graph
function display_goals_by_club(ndx) {
        var date_dim =ndx.dimension(dc.pluck("date"));
        var goals_per_season= date_dim.group().reduceSum(dc.pluck("total_goals"));
        
        var minDate = date_dim.bottom(1)[0].date;
        var maxDate = date_dim.top(1)[0].date;

        function goals_by_club(team) {
            return function(d) {
                if (d.team === team) {
                    return +d.total_goals;
                } else {
                    return 0;
                }
            };
        }
        
        var arsenalGoals = date_dim.group().reduceSum(goals_by_club('Arsenal'));
        var chelseaGoals = date_dim.group().reduceSum(goals_by_club('Chelsea'));
        var evertonGoals = date_dim.group().reduceSum(goals_by_club('Everton'));
        var leicesterGoals = date_dim.group().reduceSum(goals_by_club('Leicester'));
        var liverpoolGoals= date_dim.group().reduceSum(goals_by_club('Liverpool'));
        var mancityGoals = date_dim.group().reduceSum(goals_by_club('Man City'));
        var manUnitedGoals = date_dim.group().reduceSum(goals_by_club('Man United'));
        var southamptonGoals = date_dim.group().reduceSum(goals_by_club('Southampton'));
        var tottenhamGoals = date_dim.group().reduceSum(goals_by_club('Tottenham'));
        var westHamGoals = date_dim.group().reduceSum(goals_by_club('West Ham'));
        var compositeChart = dc.compositeChart('#goals-per-club');
        compositeChart
            .width(1000)
            .height(300)
            .dimension(date_dim)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .yAxisLabel("Goals Scored")
            .xAxisLabel("Season")
            .legend(dc.legend().x(100).y(160).itemHeight(5).gap(5))
            .renderHorizontalGridLines(true)
            .compose([
                dc.lineChart(compositeChart)
                    .colors('orange')
                    .group(arsenalGoals, 'Arsenal'),
                dc.lineChart(compositeChart)
                    .colors('blue')
                    .group(chelseaGoals, 'Chelsea'),
                dc.lineChart(compositeChart)
                    .colors('green')
                    .group(evertonGoals, 'Everton'),
                dc.lineChart(compositeChart)
                   .colors('MediumVioletRed ')
                   .group(leicesterGoals, 'Leicester '),
                dc.lineChart(compositeChart)
                    .colors('purple')
                    .group(liverpoolGoals, 'Liverpool'),
                dc.lineChart(compositeChart)
                    .colors('yellow')
                    .group(mancityGoals, 'Man City'),
                dc.lineChart(compositeChart)
                    .colors('red')
                    .group(manUnitedGoals, 'Man United'),
                dc.lineChart(compositeChart)
                    .colors('black')
                    .group(southamptonGoals, 'Southampton'),
                dc.lineChart(compositeChart)
                    .colors('white')
                    .group(tottenhamGoals, 'Tottenham'),
                dc.lineChart(compositeChart)
                    .colors('brown')
                    .group(westHamGoals, 'West Ham'),
            ])
            .brushOn(false)
            .render();
}


//Conceeded by Season
function display_conceeded_by_season(ndx) {
        var date_dim =ndx.dimension(dc.pluck("date"));
        var conceded_per_season= date_dim.group().reduceSum(dc.pluck("total_goals_conceded"));
        
        var minDate = date_dim.bottom(1)[0].date;
        var maxDate = date_dim.top(1)[0].date;
        
        function goals_conceded_by_club(team) {
            return function(d) {
                if (d.team === team) {
                    return +d.total_goals_conceded;
                } else {
                    return 0;
                }
            };
        }
        
        var arsenalGoalsConceded = date_dim.group().reduceSum(goals_conceded_by_club('Arsenal'));
        var chelseaGoalsConceded = date_dim.group().reduceSum(goals_conceded_by_club('Chelsea'));
        var evertonGoalsConceded = date_dim.group().reduceSum(goals_conceded_by_club('Everton'));
        var leicesterGoalsConceded = date_dim.group().reduceSum(goals_conceded_by_club('Leicester'));
        var liverpoolGoalsConceded= date_dim.group().reduceSum(goals_conceded_by_club('Liverpool'));
        var mancityGoalsConceded = date_dim.group().reduceSum(goals_conceded_by_club('Man City'));
        var manUnitedGoalsConceded = date_dim.group().reduceSum(goals_conceded_by_club('Man United'));
        var southamptonGoalsConceded = date_dim.group().reduceSum(goals_conceded_by_club('Southampton'));
        var tottenhamGoalsConceded = date_dim.group().reduceSum(goals_conceded_by_club('Tottenham'));
        var westHamGoalsConceded = date_dim.group().reduceSum(goals_conceded_by_club('West Ham'));
        
        
      var compositeChart = dc.compositeChart('#conceded-per-season');
        compositeChart
            .width(1000)
            .height(300)
            .dimension(date_dim)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .yAxisLabel("Goals Conceded")
            .xAxisLabel("Season")
            .legend(dc.legend().x(100).y(160).itemHeight(5).gap(5))
            .renderHorizontalGridLines(true)
            .compose([
                dc.lineChart(compositeChart)
                    .colors('orange')
                    .group(arsenalGoalsConceded, 'Arsenal'),
                dc.lineChart(compositeChart)
                    .colors('blue')
                    .group(chelseaGoalsConceded, 'Chelsea'),
                dc.lineChart(compositeChart)
                    .colors('green')
                    .group(evertonGoalsConceded, 'Everton'),
                dc.lineChart(compositeChart)
                   .colors('MediumVioletRed')
                   .group(leicesterGoalsConceded, 'Leicester '),
                dc.lineChart(compositeChart)
                    .colors('purple')
                    .group(liverpoolGoalsConceded, 'Liverpool'),
                dc.lineChart(compositeChart)
                    .colors('yellow')
                    .group(mancityGoalsConceded, 'Man City'),
                dc.lineChart(compositeChart)
                    .colors('red')
                    .group(manUnitedGoalsConceded, 'Man United'),
                dc.lineChart(compositeChart)
                    .colors('black')
                    .group(southamptonGoalsConceded, 'Southampton'),
                dc.lineChart(compositeChart)
                    .colors('white')
                    .group(tottenhamGoalsConceded, 'Tottenham'),
                dc.lineChart(compositeChart)
                    .colors('brown')
                    .group(westHamGoalsConceded, 'West Ham'),
            ])
            .brushOn(false)
            .render();
        
}





//losses per team row chart

function losses_per_team(ndx) {
    var team_dim= ndx.dimension(dc.pluck('team'));
 
    var losses_per_team = team_dim.group().reduceSum(dc.pluck("losses"));
   
    
    dc.rowChart("#losses-per-team")
        .width(400)
        .height(500)
        .margins({ top: 10, right: 20, bottom: 40, left: 20 })
        .transitionDuration(500)
        .dimension(team_dim)
        
        .group(losses_per_team);
}

//average goals by season composite graph
function display_average_goals_by_season(ndx) {
        var date_dim =ndx.dimension(dc.pluck("date"));
        var goals_per_season= date_dim.group().reduceSum(dc.pluck("goals"));
        
        var minDate = date_dim.bottom(1)[0].date;
        var maxDate = date_dim.top(1)[0].date;

        function goals_by_club(team) {
            return function(d) {
                if (d.team === team) {
                    return +d.goals;
                } else {
                    return 0;
                }
            };
        }
        
        var manchesterUnitedGoals = date_dim.group().reduceSum(goals_by_club('Manchester United'));
        var liverpoolGoals= date_dim.group().reduceSum(goals_by_club('Liverpool'));
        
        var arsenalGoals = date_dim.group().reduceSum(goals_by_club('Arsenal'));
        var chelseaGoals = date_dim.group().reduceSum(goals_by_club('Chelsea'));
        var manchestercityGoals = date_dim.group().reduceSum(goals_by_club('Manchester City'));
        var compositeChart = dc.compositeChart('#goals-per-club');
        compositeChart
            .width(1000)
            .height(200)
            .dimension(date_dim)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .yAxisLabel("Goals")
            .xAxisLabel("Season")
            .legend(dc.legend().x(100).y(90).itemHeight(5).gap(5))
            .renderHorizontalGridLines(true)
            .compose([
                dc.lineChart(compositeChart)
                    .colors('red')
                    .group(manchesterUnitedGoals, 'Manchester United'),
                dc.lineChart(compositeChart)
                    .colors('purple')
                    .group(liverpoolGoals, 'Liverpool'),
                dc.lineChart(compositeChart)
                    .colors('orange')
                    .group(arsenalGoals, 'Arsenal'),
                dc.lineChart(compositeChart)
                    .colors('blue')
                    .group(chelseaGoals, 'Chelsea'),
                dc.lineChart(compositeChart)
                    .colors('pink')
                    .group(manchestercityGoals, 'Manchester City'),
                    
            ])
            .brushOn(false)
            .render();
}


function display_average_goals_by_season(ndx) {
    var dim = ndx.dimension(dc.pluck('season'));
    
    function add_item(p, v) {
        p.count++;
        p.total += v.total_goals;
        p.average = p.total / p.count;
        return p;
    }

    function remove_item(p, v) {
        p.count--;
        if(p.count == 0) {
            p.total = 0;
            p.average = 0;
        } else {
            p.total -= v.total_goals;
            p.average = p.total / p.count;
        }
        return p;
    }
    
    function initialise() {
        return {count: 0, total: 0, average: 0};
    }

    var averageGoalsBySeason = dim.group().reduce(add_item, remove_item, initialise);

    dc.barChart("#average-goals")
        .width(400)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim)
        .group(averageGoalsBySeason)
        .valueAccessor(function(d){
            return d.value.average.toFixed(2);
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Season")
        .yAxis().ticks(20);   
}



function display_touches_by_season(ndx) {
    var dim = ndx.dimension(dc.pluck('team'));
    var wins_by_season = dim.group().reduceSum(dc.pluck('total_touches'));

   
   
   
    
    dc.barChart("#touches-per-season")
        .width(400)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim)
        .group(wins_by_season)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticX(true)
        .elasticY(true)
        .xAxisLabel("Team")
        .yAxisLabel("Touches")
        .yAxis().ticks(20);
     
        
        
}


function display_passes_by_season(ndx) {
    var dim = ndx.dimension(dc.pluck('team'));
    var wins_by_season = dim.group().reduceSum(dc.pluck('total_pass'));

   
   
   
    
    dc.barChart("#passes-per-season")
        .width(650)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim)
        .group(wins_by_season)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticX(true)
        .elasticY(true)
        .xAxisLabel("Team")
        .yAxisLabel("Passes")
        .yAxis().ticks(20);
     
        
        
}




function display_spend_by_club(ndx) {
  var date_dim = ndx.dimension(dc.pluck('date'));
  
  var min_date = date_dim.bottom(1)[0].date;
  var max_date = date_dim.top(1)[0].date;
  
  var spend_dim = ndx.dimension(function (d) {
      return [d.date, d.total_spend, d.team, d.season];
  });
  
  var spend_group = spend_dim.group();
  
  //console.log(spend_group.all())
  var teamColors = d3.scale.ordinal()
            .domain(["Arsenal", "Chelsea", "Everton", "Leicester", "Liverpool", 'Man City',"Man United", "Southampton", 'Tottenham', 'West Ham' ])
            .range(["Orange","Blue", "Green","pink", "purple", "yellow", "red", "black", "white", "brown"]);
 
 
 
  
  var spend_chart = dc.scatterPlot("#total-spend-per-club");
  spend_chart   
    .width(768)
    .height(480)
   
    .x(d3.time.scale().domain([min_date, max_date]))
    .brushOn(false)
    .symbolSize(8)
    .clipPadding(10)
    .yAxisLabel("Amount Spent In Millions")
    .title(function (d) {
        return d.key[2]+ " spent " + d.key[1] + " million in " +d.key[3];
    })
    .colorAccessor(function (d) {
        return d.key[2];
    })
    .colors(teamColors)
    .dimension(spend_dim)
    .group(spend_group);
    
}


}