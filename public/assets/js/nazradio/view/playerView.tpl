<div class="wrap_progress" style="height:50px; width: 100%;">
	<div class="global_right_margin global_right_margin_sm wrap_right">
		<button type="button" class="btn btn-default" id="control-backward" style="margin-left:1px;margin-rigth:1px;">
			<span class="glyphicon glyphicon-step-backward"></span>
		</button>
		<button type="button" class="btn btn-default" id="control-stop" style="margin-left:1px;margin-rigth:1px;">
			<span class="glyphicon glyphicon-stop"></span>
		</button>
		<button type="button" class="btn btn-default"  id="control-play" style="margin-left:1px;margin-rigth:1px;">
			<span class="glyphicon glyphicon-<%if (play) {%>pause<%} else {%>play<%}%>"></span>
		</button>
		<button type="button" class="btn btn-default"  id="control-forward" style="margin-left:1px;margin-rigth:1px;">
			<span class="glyphicon glyphicon-step-forward"></span>
		</button>
	</div>
    <h4 class="global_left_margin wrap_title" style="padding-top: 6px; "><%if (artist != null && artist.length > 0) {%><%=artist%><%} else {%><%=radio%></%><%}%></h4>
</div>
<div class="progress global_left_margin global_right_margin global_right_margin_sm">
	<div class="progress-bar progress-bar-success" role="progressbar"
		aria-valuenow="<%=pct%>" aria-valuemin="0" aria-valuemax="100" style="width: <%=pct%>%" id="progress">
		<span class="sr-only"><%=pct%>% playing</span>
	</div>
	<div class="wrap_progress" style="position:absolute;">
        <div class="wrap_right wrap_time_player"><%=ellapsed_time%> / <%=total_time%></div>
        <div class="wrap_title"><b><%=title%></b><%if (title != null && title.length > 0) {%> - <%}%><%=album%></div>
    </div>
</div>