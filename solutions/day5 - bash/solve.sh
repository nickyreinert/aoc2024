#!/bin/bash

# load rules
while IFS="|" read -r col1 col2; do
  if [[ ${rules["$col1"]+_} ]]; then
    rules["$col1"]+=",${col2}"
  else
    rules["$col1"]="$col2"
  fi
done < input_rules.txt

update_value=0
fixed_update_value=0
update_is_valid=1

# loop through "updates"
while IFS=',' read -r -a updates; do
  
    updates_string=$(IFS=,; echo "${updates[*]}")

    echo "update: ${updates_string}"

    # loop through all pages of the current update
    for page in "${updates[@]}"; do

        # check if the page is part of a rule
        # if it does
        if [[ ${rules["$page"]+_} ]]; then

            # get all rules for the page
            IFS=',' read -r -a subsequent_pages <<< "${rules[$page]}"

            for subsequent_page in "${subsequent_pages[@]}"; do

                # do a negative check: does subsequent page comes before
                # the current page? then it's against the rule and this update
                # is not valid
                # example: 61.*?(,29)(,|$)
                
                regex="(${subsequent_page}).*?,(${page})(,|$)"

                # once a match is found, the whole update is invalid
                if echo "$updates_string" | grep -qE "$regex"; then
                    
                    # lets try to fix it!
                    update_is_valid=0

                    page_index=-1
                    subsequent_page_index=-1

                    # to solve the second part, we must not break the loop /bc we try to fix the whole update!
                    # first we need to get the index of both pages from the update
                    for index in "${!updates[@]}"; do
                        if [[ ${updates[$index]} -eq $page && $page_index -eq -1 ]]; then
                            page_index=$index
                        fi
                        if [[ ${updates[$index]} -eq $subsequent_page && $subsequent_page_index -eq -1 ]]; then
                            subsequent_page_index=$index
                        fi
                    done

                    if [[ $page_index -ge 0 && $subsequent_page_index -ge 0 ]]; then
                        # now swap pages
                        echo "Before swap: ${updates[@]}"

                        updates[page_index]=$subsequent_page
                        updates[subsequent_page_index]=$page

                        echo "After swap: ${updates[@]}"
                    fi
                fi

            done
            
        fi

        # this would speed up solving the first part, the second part 
        # requires us to fix all updates, so we cannot break out of the loop
        # if [[ $update_is_valid -eq 0 ]]; then 
        #     break
        # fi

    done

    length=${#updates[@]}
    middle_index=$((length / 2))
    middle_item=${updates[middle_index]}
    if [[ $update_is_valid -eq 1 ]]; then
        echo " update is valid"
        update_value=$((update_value + middle_item))
    else
        echo " update is invalid"
        fixed_update_value=$((fixed_update_value + middle_item))
    fi

    # reset the validation flag
    update_is_valid=1

done < input_updates.txt

echo "updates value is {$update_value}"
echo "fixed updates value is {$fixed_update_value}"
