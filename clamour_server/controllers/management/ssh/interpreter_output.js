module.exports.get_csv_names = function (ssh_output_string) {
    var reg_expression = RegExp(/\b.*?((?!\*).)\.csv/g);
    var csv_files_list = null;
    if (csv_files_list = ssh_output_string.match(reg_expression)) {
        for (i = 0, len = csv_files_list.length; i < len; i++) {
            csv_files_list[i] = csv_files_list[i].trim();
        }
    }
    return csv_files_list;
}

module.exports.found_csv_name = function (ssh_output_string) {
    var reg_expression = RegExp(/\b.*?((?!\*).)\.csv/g);
    if (csv_files_list = ssh_output_string.match(reg_expression))
        return true;
    else return false;
}

module.exports.found_status_cue = function (ssh_output_string) {
    var reg_expression = RegExp(/(?<!")<\s*[(status)][^>]*>/g);
    if (String(ssh_output_string).match(reg_expression))
        return true;
    else return false;
}

module.exports.found_running_status = function (ssh_output_string) {
    var reg_expression = RegExp(/[0-9]+/g);
    if (String(ssh_output_string).match(reg_expression))
        return true;
    else return false;
}