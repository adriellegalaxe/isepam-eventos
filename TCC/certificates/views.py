from django.shortcuts import render, redirect
from .models import Certificate
from reportlab.pdfgen import canvas
from django.http import HttpResponse

# Create your views here.

def certificates_list(request):
    if not request.user.is_authenticated:
        return redirect('account_login')
    certificates = Certificate.objects.filter(user=request.user)
    context = {'certificates': certificates}
    return render(request, 'certificates.html', context)

def download_certificate(request, cert_id):
    cert = Certificate.objects.get(id=cert_id, user=request.user)
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="certificado_{cert.event.name}.pdf"'
    p = canvas.Canvas(response)
    p.drawString(100, 750, "O Instituto Superior de Educação Professor Aldo Muylaert - FAETEC certifica que:")
    p.drawString(100, 700, cert.user.full_name)
    p.drawString(100, 650, f"participou do evento {cert.event.name}, realizado em {cert.event.date},")
    p.drawString(100, 600, f"perfazendo a carga horária de {cert.event.total_hours} horas.")
    p.showPage()
    p.save()
    return response
