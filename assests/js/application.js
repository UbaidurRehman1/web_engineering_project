function searchjobs()
{
    // Declare variables
    var input, filter, title, i, txtValue;
    input = document.getElementById("text232");
    filter = input.value.toUpperCase();
  
    var divs = document.getElementsByClassName("jobs");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < divs.length; i++)
    {
      title = divs[i].getElementsByClassName("title")[0];

      txtValue = title.textContent || title.innerText;

      if (txtValue.toUpperCase().indexOf(filter) > -1)
      {
        divs[i].style.display = "";
      }
      else
      {
        divs[i].style.display = "none";
      }
    }
}