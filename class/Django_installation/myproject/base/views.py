from django.shortcuts import render

# Create your views here.

qspiders=[
    {
        'id':1,
        'subject': 'Python',
        'trainer': 'afnan',
        'feedback': 'confidence booster trainer and best in qspider history',
    },
    {
        'id':2,
        'subject': 'sql',
        'trainer': 'DG',
        'feedback': 'Best in qspider history trainer',
    },
    {
        'id':3,
        'subject': 'webtechnology',
        'trainer': 'prajwal',
        'feedback': 'Chill and cool trainer',
    },
    {
        'id':4,
        'subject': 'aptitude',
        'trainer': 'rakshitha',
        'feedback': 'beauty with brain trainer',
    },
    {
        'id':5,
        'subject': 'django',
        'trainer': 'sakshi',
        'feedback': 'story teller trainer ',
    },
]

def home(request):   # view
    return render(request, 'home.html', {'guru': qspiders})# render is a function which takes 3 parameters request, template name and context


def about(request,pk):
    for i in qspiders:
        if i['id']==pk:
            return render(request, 'about.html', {'rudra': i})

