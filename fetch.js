<script>
        $(document).ready(function() {
            $('#bookingIcon').click(function() {
                $.ajax({
                    url: 'https://api.steinhq.com/v1/storages/6651f7d2b030b46c843a34fd/Sheet3',
                    method: 'GET',
                    success: function(data) {
                        let detailsContainer = $('#bookingDetails');
                        detailsContainer.empty();
                        data.filter(item => item.cancel !== 'Cancelled').forEach(item => {
                            detailsContainer.append(`
                                <div class="card" data-id="${item.name}">
                                    <div class="card-body">
                                        <h5 class="card-title"><font style="color:white;">Name:</font> ${item.name}</h5>
                                        <p class="card-text"><font style="color:white; font-weight:bold;">Phone:</font><br> ${item.phone}</p>
                                        <p class="card-text"><font style="color:white; font-weight:bold;">Payment:</font> ${item.paymentType}</p>
                                        <button class="btn btn-danger cancel-btn" data-id="${item.name}">Cancel</button>
                                    </div>
                                </div>
                            `);
                        });
                        $('#bookingModal').modal('show');
                    },
                    error: function(error) {
                        console.log("Error fetching data", error);
                    }
                });
            });

            $(document).on('click', '.cancel-btn', function() {
                let bookingId = $(this).data('id');
                $('#cancelBookingId').val(bookingId);
                $('#confirmCancelModal').modal('show');
            });

            $('#confirmCancelBtn').click(function() {
                let bookingId = $('#cancelBookingId').val();
                $('#confirmCancelModal').modal('hide');
                $('#passcodeModal').modal('show');

                $('#submitPasscodeBtn').off('click').click(function() {
                    let passcode = $('#passcodeInput').val();
                    $('#passcodeModal').modal('hide');
                    
                    $.ajax({
                        url: 'https://api.steinhq.com/v1/storages/6651f7d2b030b46c843a34fd/Sheet3',
                        method: 'GET',
                        success: function(data) {
                            let booking = data.find(item => item.name === bookingId);
                            if (booking && booking.passcode === passcode) {
                                $.ajax({
                                    url: 'https://api.steinhq.com/v1/storages/6651f7d2b030b46c843a34fd/Sheet3',
                                    method: 'PUT',
                                    contentType: 'application/json',
                                    data: JSON.stringify({
                                        condition: { name: bookingId },
                                        set: { cancel: 'Cancelled' }
                                    }),
                                    success: function(response) {
                                        $('#resultMessage').text('Booking cancelled successfully.');
                                        $('#resultModal').modal('show');
                                        $(`div[data-id="${bookingId}"]`).remove();
                                    },
                                    error: function(error) {
                                        console.log('Error updating booking', error);
                                        $('#resultMessage').text('Error updating booking: ' + JSON.stringify(error));
                                        $('#resultModal').modal('show');
                                    }
                                });
                            } else {
                                $('#resultMessage').text('Passcode does not match.');
                                $('#resultModal').modal('show');
                            }
                        },
                        error: function(error) {
                            console.log('Error fetching booking', error);
                            $('#resultMessage').text('Error fetching booking: ' + JSON.stringify(error));
                            $('#resultModal').modal('show');
                        }
                    });
                });
            });
        });
    </script>
