from django.shortcuts import render, redirect
from .models import Event, Attendance
from certificates.models import Certificate
from django.utils import timezone
from django.http import HttpResponse
import qrcode
from io import BytesIO

# Create your views here.

def register_for_event(request, event_id):
    if not request.user.is_authenticated:
        return redirect('account_login')
    event = Event.objects.get(id=event_id)
    if request.user not in event.participants.all():
        event.participants.add(request.user)
        for session in event.sessions.all():
            Attendance.objects.create(user=request.user, session=session)
    return redirect('home')

def confirm_attendance(request, qr_code):
    try:
        attendance = Attendance.objects.get(qr_code=qr_code)
        if not attendance.confirmed:
            attendance.confirmed = True
            attendance.confirmed_at = timezone.now()
            attendance.save()
            # Check if all sessions confirmed
            event = attendance.session.event
            user = attendance.user
            total_sessions = event.sessions.count()
            confirmed_count = Attendance.objects.filter(user=user, session__event=event, confirmed=True).count()
            if confirmed_count == total_sessions:
                Certificate.objects.get_or_create(user=user, event=event)
        return render(request, 'attendance_confirmed.html')
    except Attendance.DoesNotExist:
        return render(request, 'invalid_qr.html')

def qr_code_image(request, attendance_id):
    attendance = Attendance.objects.get(id=attendance_id, user=request.user)
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(attendance.qr_code)
    qr.make(fit=True)
    img = qr.make_image(fill='black', back_color='white')
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    return HttpResponse(buffer.getvalue(), content_type='image/png')

def my_qr_codes(request):
    attendances = Attendance.objects.filter(user=request.user)
    context = {'attendances': attendances}
    return render(request, 'my_qr_codes.html', context)
