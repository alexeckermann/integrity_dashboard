$(function(){
	
	var Dashbaord = window.Dashboard = {
		
		_overviewTimer: 0,
		_overviewRefreshRate: 30000,
		_months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		
		init: function(arg_url){
	
			this._updateOverview();
			
		},
		
		_updateOverview: function(){
			
			var updateTimer = setTimeout(Dashboard._failedOverviewUpdate, 3000);
			
			$.getJSON("/remote/overview", function(data, status){
				clearTimeout(updateTimer);
				
				var results = $("#projects ul.results");
				
				if(data.length > 0) $("li", results).remove();
				
				for(var idx in data) {
					
					var project = data[idx];
					
					var pobj = $("<li></li>");
					
					var	title = $("<h2></h2>").html(project.name),
							status = Dashboard._statusElement(project.build.status),
							author = $("<p></p>").addClass("author").html(project.build.author),
							message = $("<p></p>").addClass("message").html(project.build.message + "<br />" + project.build.identifier),
							timestamp = $("<p></p>").addClass("timestamp").html(Dashboard._prettyTime(project.build.committed_at));
					
					pobj.addClass("status").addClass(project.status).append(title);
					pobj.append(status).append(author).append(message).append(timestamp);
					results.append(pobj);
					
				}
				
				Dashboard._scheduleOverviewUpdate();
				
			});
			
		},
		
		_statusElement: function(arg_status) {
			
			var obj;
			
			if (arg_status == "failed") {
				obj = this._failStatusElement();
			} else if (arg_status == "pending") {
				obj = this._pendingStatusElement();
			} else if (arg_status == "success") {
				obj = this._successStatusElement();
			} else {
				obj = this._unknownStatusElement(arg_status);
			}
			
			return obj;
			
		},
		
		_failStatusElement: function(){
			
			return $("<p></p>").addClass("status").html("FAIL");
			
		},
		
		_successStatusElement: function(){
			
			return $("<p></p>").addClass("status").html("WIN");
			
		},
		
		_pendingStatusElement: function(){
			
			return $("<p></p>").addClass("status").html("WAIT");
			
		},
		
		_unknownStatusElement: function(arg_status){
			
			return $("<p></p>").addClass("status").html("DUNNO: "+arg_status);
			
		},
		
		_failedOverviewUpdate: function(){
			
			$("#projects .status").html("Failed update!").addClass("failed");
			
			Dashboard._scheduleOverviewUpdate();
			
		},
		
		_scheduleOverviewUpdate: function(){
			
			if (this._overviewTimer > 0)
				clearTimeout(this._overviewTimer);
			
			this._overviewTimer = setTimeout(Dashboard._updateOverview, this._overviewRefreshRate);
			
		},
		
		_prettyTime: function(arg_str) {
			
			var date = this._parseISO8601Time(arg_str);
			
			return date.getDate() + " " + this._months[date.getMonth()] + ", " + date.getHours() + ":" + date.getMinutes();
			
		},
		
		_parseISO8601Time: function(str) {
			
			var parts = str.split('T'),
			 dateParts = parts[0].split('-'),
			 timeParts = parts[1].split('+'),
			 timeSubParts = timeParts[0].split(':'),
			 timeSecParts = timeSubParts[2].split('.'),
			 timeHours = Number(timeSubParts[0]),
			 _date = new Date;

			 _date.setUTCFullYear(Number(dateParts[0]));
			 _date.setUTCMonth(Number(dateParts[1])-1);
			 _date.setUTCDate(Number(dateParts[2]));
			 _date.setUTCHours(Number(timeHours));
			 _date.setUTCMinutes(Number(timeSubParts[1]));
			 _date.setUTCSeconds(Number(timeSecParts[0]));
			 if (timeSecParts[1]) _date.setUTCMilliseconds(Number(timeSecParts[1]));

			 return _date;
			
		}
		
	}
	
});