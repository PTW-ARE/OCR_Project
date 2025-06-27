import re

def extract_fields(text: str):
    
    cleaned_text = text.replace('\n', ' ')

    # Tracking Numbers
    tracking_matches = re.findall(r"\b[A-Za-z]\d[\s\-]?[\w\-]+[\s\-]?\d{3,6}[A-Z]?\b", cleaned_text)
    tracking_numbers = list(set(tracking_matches))

    # Phone Numbers
    phone_pattern = r"\(\+66\)\d{2}[\d\*]{6}\d{2}|\(\+66\)\d{2}[\d\*]{5}\d{2}"
    phone_numbers = list(set(re.findall(phone_pattern, cleaned_text)))
    
    # Name
    name_pattern = r"ถึง\s+([^\s]+)"
    name_matches = re.findall(name_pattern, cleaned_text)
    name_matches = list(set([name.strip() for name in name_matches if len(name.strip()) >= 3]))

    # Addresses 
    address_matches = []
    for name in name_matches:
        name_index = cleaned_text.find(name)
        if name_index != -1:
            after_name_text = cleaned_text[name_index + len(name):]
            address_match = re.search(r"(.*?\d{5})", after_name_text)
            if address_match:
                address = address_match.group(1).strip()
                address_matches.append(address)

    # Zipcodes
    zipcode_matches = []
    for address in address_matches:
        zips = re.findall(r"\b\d{5}\b", address)
        zipcode_matches.extend(zips)

    zipcode_matches = list(set(zipcode_matches))
    
    
    return {
        "tracking_numbers": tracking_numbers,
        "phone_matches": phone_numbers,
        "name_matches": name_matches,
        "address_matches": address_matches,
        "zipcode_matches": zipcode_matches,
    }