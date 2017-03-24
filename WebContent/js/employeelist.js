var serviceURL = "https://jsonplaceholder.typicode.com/";

var employees;

$('#employeeListPage').bind('pageinit', function(event) {
	getEmployeeList();
});

function getEmployeeList() {
	$.getJSON(serviceURL + 'users', function(data) {
		$('#employeeList li').remove();
		employees = data;
		$.each(employees, function(index, employee) {
			$('#employeeList').append('<li><a href="#detailsPage">' +
					'<img src="./pics/' + employee.username + '.jpg' + '" class="thumb_profile"/>' +
					'<h4>' + employee.name + '</h4>' +
					'<p>' + employee.email + '</p>' +
					'<span class="ui-li-count">' + employee.id + '</span></a></li>');
		});
		$('#employeeList').listview('refresh');
	});
}