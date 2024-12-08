import Swal from 'sweetalert2';

export class Message
{
    static show_message(title: string, msg: string, isError: boolean = false)
    {
        return Swal.fire({ title: title, text: msg, icon: isError ? 'error': 'success' });
    }

    static show_info_message(title: string, msg: string)
    {
        return Swal.fire({ title: title, text: msg, icon: 'info' });
    }

    static async ask_question_is_accepted(title: string, msg: string, accept_text: string, cancel_text: string): Promise<boolean>
    {
        let res = await Swal.fire({title: title, text: msg, showConfirmButton: true, showDenyButton: true, confirmButtonText: accept_text, denyButtonText: cancel_text });
        return res.isConfirmed;
    }
};