window.onload=function()
		{
			var ul=document.querySelector("#menu ul");
			var active=document.querySelector("#menu ul li.active");
			ul.onclick=function(event)
			{
				var target=event.target;
				if(target.tagName!=="LI")
					return;
				active=document.querySelector("#menu ul li.active");
				active.classList.remove("active");
				target.classList.add("active");
				getData(target);
			}
			getData(active);
			search.onkeyup=function()//підкидання пропозицій в список
			{
				var searchValue={value:$("#search").val()};
				console.log(searchValue)
				$.post('/search',searchValue,function(data){
					console.log(data);
					if($("#search").val()!=="")
					{
						$("#list li").remove();
						for(var i=0; i<data.length;  i++)
						{
							$("<li>").html(data[i].firstName+" "+data[i].lastName).appendTo(list);
						}
					}
					else
					{
						$("#list li").remove();
					}
				});
				list.onclick=function(event)
				{
					var target=event.target;
					if(target.tagName=="LI")
						$("#search").val(target.innerHTML);
					$("#list li").remove();
				}
				search.onfocus=function()
				{
					$(this).val("");
					$("#info li").remove();
				}
			}
			load.onclick=function()//кнопка Load
			{
				var data={value:$("#search").val()};
				if(data.value=="")
					return;
				$.post('/load',data,function(data){
					console.log(data);
					$("#info").html("<li>");
					$("#info li").text("Ім'я: "+data[0].firstName+" | "+"Прізвище: "+data[0].lastName+" | "+"Вік: "+data[0].age+" | "+"Зарплата: "+data[0].salary);
				});
			}
		}
		function getData(li,obj)
		{
			var path=null;
			if(li.innerHTML=='Перегляд')
			{
				path='/data';
				$("#searchForm").show();
			}
			else
			{
				path='/form';
				$("#searchForm").hide();
			}

			$.get(path,function(data){
				console.log(data);
				if($(li).text()=='Перегляд')
				{
					parseFile(data,content);
					return;
				}
				$("#content").html(data);
				if(obj==undefined)
				{
					rowId.value="";
					return;
				}
				firstName.value=obj.firstName;
				lastName.value=obj.lastName;
				age.value=obj.age;
				salary.value=obj.salary;
				rowId.value=obj.rowId;
				sendData.value="Update";

			});
		}
		function parseFile(file,content)//Формування таблиці
		{
			console.log(file);
			var mas=["Ім'я","Прізвище","Вік","Зарплата",""];
			var mas1=["firstName","lastName","age","salary","_id"];
			content.innerHTML="";
			var table=document.createElement("table");
			content.appendChild(table);
			var tr=document.createElement("tr");
			table.appendChild(tr);
			for(var i=0;i<mas.length;i++)
			{
				var td=document.createElement("td");
				td.innerHTML=mas[i];
				td.classList.add("header");

				td.onclick=function()
				{
					var pos=this.cellIndex;
					var rows=document.querySelectorAll("#content table tr:not(:first-child)");
					var rowsArray=[].slice.call(rows);
					function sortText(a,b){
						if(a.cells[pos].innerHTML>b.cells[pos].innerHTML)
							return 1;
						return -1;
					}
					function sortNumber(a,b){
						return a.cells[pos].innerHTML-b.cells[pos].innerHTML;
					}
					if(pos==2 || pos==3)
						rowsArray.sort(sortNumber)
					else
						rowsArray.sort(sortText)

					for(var i=0;i<rows.length;i++)
					{
						table.removeChild(rows[i])
					}
					for(var i=0;i<rowsArray.length;i++)
					{
						table.appendChild(rowsArray[i]);
					}
					
				}
				tr.appendChild(td);

			}
			for(var i=0;i<file.length;i++)
			{
				var tr=document.createElement("tr");
				table.appendChild(tr);
				for(var j=0;j<mas1.length;j++)
				{
					var td=document.createElement("td");
					td.innerHTML=file[i][mas1[j]];
					tr.appendChild(td);
				}
				$("td:last").hide();
				td=document.createElement("td");
				var btn=document.createElement("button");
				td.appendChild(btn);
				btn.innerHTML="Delete X";
				btn.classList.add("btnDel");
				btn.onclick=delClick;
				tr.appendChild(td);
				var btn=document.createElement("button");
				td.appendChild(btn);
				btn.innerHTML="Update";
				btn.classList.add("btnUpd");
				btn.onclick=updClick;
			}
		}
		function delClick()//кнопка Delete
		{
			var row=this.parentNode.parentNode.rowIndex;
			var id=document.querySelector("table").rows[row].cells[4].innerHTML;
			var sendId={_id:id};
			$.post('/sendId',sendId,function(data){
				console.log(data);
				var li=document.querySelector("#menu ul li:nth-child(1)");
				console.log(li);
				getData(li);
			});
		}

		function updClick()//кнопка Update
		{
			var tr=this.parentNode.parentNode;
			var obj={};
			obj.firstName=tr.cells[0].innerHTML;
			obj.lastName=tr.cells[1].innerHTML;
			obj.age=tr.cells[2].innerHTML;
			obj.salary=tr.cells[3].innerHTML;
			obj.rowId=tr.cells[4].innerHTML;
			console.log(obj);
			var li=document.querySelector("#menu ul li:nth-child(2)");
			console.log(li.innerHTML);
			getData(li,obj);
			
		}
		function sData(id)//кнопка Send
		{
			var obj={
				firstName:$("#firstName").val(),
				lastName:$("#lastName").val(),
				age:$("#age").val(),
				salary:$("#salary").val(),
				rowId:$("#rowId").val()
			};
			console.log(obj.rowId+" new")
			$.post('/sendData',obj,function(data){
				alert(data);
				$("input[type='text']").val("");
				$("#content input[type='button']").val("Send");
			});
		}