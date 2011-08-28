# Create your views here.
from django.http import HttpResponse,HttpResponseRedirect
from django.template import Context,loader,RequestContext
from django.shortcuts import render_to_response
from django.core.urlresolvers import reverse
from django.contrib import auth
from engine.models import *
STATIC_URL = "/static/"

def index(request):
    t = loader.get_template('index.html')
    c = RequestContext(request, {
            #vars
            })
    response = HttpResponse(t.render(c))
    return response
